import { prisma } from "@/lib/prisma";
import { getWalletsSummary } from "@/lib/services/wallet-service";

let userId: string, walletId: string, categoryId: string;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: { name: "Test", email: `wallet-${Date.now()}@test.com`, password: "123" },
  });
  userId = user.id;
  walletId = (await prisma.wallet.create({ data: { name: "Principal", userId } })).id;
  categoryId = (await prisma.category.create({ data: { name: "Geral", color: "#000", userId } })).id;
});

afterAll(async () => {
  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.category.deleteMany({ where: { userId } });
  await prisma.wallet.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
});

it("retorna summary zerado sem transações", async () => {
  const summary = await getWalletsSummary({ userId });
  expect(summary).toHaveLength(1);
  expect(summary[0].totalIncome).toBe(0);
  expect(summary[0].totalExpense).toBe(0);
  expect(summary[0].balance).toBe(0);
  expect(summary[0].lastTransaction).toBeNull();
});

it("calcula totalIncome, totalExpense e balance all-time", async () => {
  await prisma.transaction.createMany({
    data: [
      { description: "Salário", value: 5000, type: "income", walletId, categoryId, userId, date: new Date("2024-01-05") },
      { description: "Aluguel", value: 1500, type: "expense", walletId, categoryId, userId, date: new Date("2024-01-10") },
      { description: "Freela", value: 1000, type: "income", walletId, categoryId, userId, date: new Date("2024-06-01") },
    ],
  });

  const summary = await getWalletsSummary({ userId });
  const w = summary[0];
  expect(w.totalIncome).toBe(6000);
  expect(w.totalExpense).toBe(1500);
  expect(w.balance).toBe(4500);
  expect(w.lastTransaction?.amount).toBe(1000);
});

it("com filtro de mês, balance usa saldo do período", async () => {
  const summary = await getWalletsSummary({ userId, month: 1, year: 2024 });
  const w = summary[0];
  expect(w.totalIncome).toBe(5000);
  expect(w.totalExpense).toBe(1500);
  expect(w.balance).toBe(3500);
});
