import { prisma } from "@/lib/prisma";
import { getCategoriesSummary } from "@/lib/services/category-service";

let userId: string;
let cat1: string, cat2: string;
let walletId: string;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: { name: "Test", email: `cat-${Date.now()}@test.com`, password: "123" },
  });
  userId = user.id;
  walletId = (await prisma.wallet.create({ data: { name: "Carteira", userId } })).id;
  cat1 = (await prisma.category.create({ data: { name: "Alimentação", color: "#f00", userId } })).id;
  cat2 = (await prisma.category.create({ data: { name: "Transporte", color: "#00f", userId } })).id;
});

afterAll(async () => {
  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.category.deleteMany({ where: { userId } });
  await prisma.wallet.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
});

it("retorna summary com valores zerados quando não há transações", async () => {
  const summary = await getCategoriesSummary({ userId });
  expect(summary).toHaveLength(2);
  summary.forEach((s) => {
    expect(s.value).toBe(0);
    expect(s.number).toBe(0);
    expect(s.relationship).toEqual([]);
  });
});

it("agrupa transações por categoria", async () => {
  await prisma.transaction.createMany({
    data: [
      { description: "Mercado", value: 200, type: "expense", categoryId: cat1, walletId, userId, date: new Date("2024-06-10") },
      { description: "Mercado", value: 50, type: "expense", categoryId: cat1, walletId, userId, date: new Date("2024-06-15") },
      { description: "Uber", value: 30, type: "expense", categoryId: cat2, walletId, userId, date: new Date("2024-06-20") },
    ],
  });

  const summary = await getCategoriesSummary({ userId });
  const alim = summary.find((c) => c.id === cat1)!;
  const transp = summary.find((c) => c.id === cat2)!;

  expect(alim.value).toBe(250);
  expect(alim.number).toBe(2);
  expect(alim.relationship).toEqual(["Mercado"]);

  expect(transp.value).toBe(30);
  expect(transp.number).toBe(1);
  expect(transp.relationship).toEqual(["Uber"]);
});

it("filtra por mês/ano", async () => {
  await prisma.transaction.createMany({
    data: [
      { description: "Antigo", value: 999, type: "expense", categoryId: cat1, walletId, userId, date: new Date("2023-01-01") },
    ],
  });

  const summary = await getCategoriesSummary({ userId, month: 6, year: 2024 });
  const alim = summary.find((c) => c.id === cat1)!;
  expect(alim.value).toBe(250);
  expect(alim.number).toBe(2);
});
