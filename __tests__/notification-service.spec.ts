import { prisma } from "@/lib/prisma";
import { getNotifications } from "@/lib/services/notification-service";

jest.mock("next/headers", () => ({
  cookies: () => ({ get: () => ({ value: "pt-BR" }) }),
}));

let userId: string, categoryId: string, walletId: string;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: { name: "Test", email: `notif-${Date.now()}@test.com`, password: "123" },
  });
  userId = user.id;
  categoryId = (await prisma.category.create({ data: { name: "Geral", color: "#000", userId } })).id;
  walletId = (await prisma.wallet.create({ data: { name: "Carteira", userId } })).id;
});

afterAll(async () => {
  await prisma.notification.deleteMany({ where: { userId } });
  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.category.deleteMany({ where: { userId } });
  await prisma.wallet.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
});

it("cria notificações para despesas vencidas sem notificação", async () => {
  await prisma.transaction.createMany({
    data: [
      { description: "Conta luz", value: 150, type: "expense", categoryId, walletId, userId, date: new Date("2024-01-01") },
      { description: "Assinatura", value: 30, type: "expense", categoryId, walletId, userId, date: new Date("2099-01-01") },
      { description: "Salário", value: 5000, type: "income", categoryId, walletId, userId, date: new Date("2024-01-01") },
    ],
  });

  const result = await getNotifications(userId);

  expect(result).toHaveLength(1);
  expect(result[0].transaction?.description).toBe("Conta luz");
  expect(result[0].message).toContain("150");
});

it("não duplica notificações na segunda chamada", async () => {
  await prisma.notification.deleteMany({ where: { userId } });

  const before = await prisma.notification.count({ where: { transaction: { description: "Conta luz" } } });
  expect(before).toBe(0);

  await getNotifications(userId);
  const afterFirst = await prisma.notification.count({ where: { transaction: { description: "Conta luz" } } });
  expect(afterFirst).toBe(1);

  await getNotifications(userId);
  const afterSecond = await prisma.notification.count({ where: { transaction: { description: "Conta luz" } } });
  expect(afterSecond).toBe(1);
});

it("marca notificação como lida e não a retorna", async () => {
  const dueOnly = await prisma.transaction.findFirst({
    where: { userId, type: "expense", notifications: { none: {} } },
  });
  if (!dueOnly) return;

  await getNotifications(userId);
  const notif = await prisma.notification.findFirst({ where: { userId } });
  if (!notif) return;

  await prisma.notification.update({ where: { id: notif.id }, data: { read: true } });

  const result = await getNotifications(userId);
  expect(result).toHaveLength(0);
});
