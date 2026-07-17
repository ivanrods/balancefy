import { prisma } from "@/lib/prisma";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionChart,
} from "@/lib/services/transaction-service";

let userId: string, categoryId: string, walletId: string;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: { name: "Test", email: `tx-${Date.now()}@test.com`, password: "123" },
  });
  userId = user.id;
  categoryId = (await prisma.category.create({ data: { name: "Categoria", color: "#000", userId } })).id;
  walletId = (await prisma.wallet.create({ data: { name: "Carteira", userId } })).id;
});

afterAll(async () => {
  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.category.deleteMany({ where: { userId } });
  await prisma.wallet.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
});

const makeTx = (overrides = {}) => ({
  description: "Compra", value: 50, categoryId, walletId, type: "expense" as const,
  date: "2024-06-15", ...overrides,
});

it("cria e retorna transação", async () => {
  const tx = await createTransaction(userId, makeTx());
  expect(tx.id).toBeDefined();
  expect(tx.value).toBe(50);
  expect(tx.type).toBe("expense");
  expect(tx.description).toBe("Compra");
});

it("lista transações com filtro de mês", async () => {
  await createTransaction(userId, makeTx({ date: "2024-06-01" }));
  await createTransaction(userId, makeTx({ date: "2024-07-01" }));
  const list = await getTransactions(userId, { month: 6, year: 2024 });
  expect(list.every((t) => new Date(t.date).getMonth() === 5)).toBe(true);
});

it("atualiza transação", async () => {
  const tx = await createTransaction(userId, makeTx());
  const updated = await updateTransaction(tx.id, makeTx({ description: "Alterado", value: 99 }));
  expect(updated.description).toBe("Alterado");
  expect(updated.value).toBe(99);
});

it("deleta transação e notificações associadas", async () => {
  const tx = await createTransaction(userId, makeTx());
  await prisma.notification.create({
    data: { userId, transactionId: tx.id, message: "teste" },
  });
  await deleteTransaction(tx.id);
  const found = await prisma.transaction.findUnique({ where: { id: tx.id } });
  const notif = await prisma.notification.findFirst({ where: { transactionId: tx.id } });
  expect(found).toBeNull();
  expect(notif).toBeNull();
});

it("getTransactionChart agrupa por mês", async () => {
  await createTransaction(userId, makeTx({ value: 100, type: "income", date: "2024-01-10" }));
  await createTransaction(userId, makeTx({ value: 30, type: "expense", date: "2024-01-15" }));
  const chart = await getTransactionChart(userId, "month", null, 2024) as { month: string; income: number; expense: number }[];
  const jan = chart.find((c) => c.month === "janeiro");
  expect(jan?.income).toBe(100);
  expect(jan?.expense).toBe(30);
});

it("getTransactionChart agrupa por semana", async () => {
  await createTransaction(userId, makeTx({ value: 200, type: "income", date: "2024-06-03" }));
  const chart = await getTransactionChart(userId, "week", 6, 2024) as { week: string; income: number; expense: number }[];
  const s1 = chart.find((c) => c.week === "Semana 1");
  expect(s1?.income).toBe(200);
});

it("rejeita dados inválidos", async () => {
  await expect(createTransaction(userId, makeTx({ value: -1 }))).rejects.toThrow();
  await expect(createTransaction(userId, makeTx({ description: "ab" }))).rejects.toThrow();
});
