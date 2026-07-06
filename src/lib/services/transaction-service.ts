import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/schemas/transaction-schema";

type TransactionFilters = {
  month?: number | null;
  year?: number | null;
};

function buildDateFilter(month?: number | null, year?: number | null) {
  if (month == null) return {};
  const y = year ?? new Date().getFullYear();
  return {
    date: {
      gte: new Date(y, month - 1, 1),
      lte: new Date(y, month, 0, 23, 59, 59, 999),
    },
  };
}

export async function getTransactions(userId: string, filters?: TransactionFilters) {
  const dateFilter = buildDateFilter(filters?.month, filters?.year);

  return prisma.transaction.findMany({
    where: { userId, ...dateFilter },
    include: { category: true, wallet: true },
    orderBy: { date: "desc" },
  });
}

export async function createTransaction(
  userId: string,
  body: Record<string, unknown>,
) {
  const parsed = transactionSchema.parse({ ...body, date: new Date(body.date as string) });
  const { description, value, categoryId, walletId, type, date } = parsed;

  return prisma.transaction.create({
    data: { description, categoryId, walletId, value, type, date, userId },
  });
}

export async function updateTransaction(id: string, body: Record<string, unknown>) {
  const parsed = transactionSchema.parse({ ...body, date: new Date(body.date as string) });
  const { description, categoryId, walletId, value, type, date } = parsed;

  return prisma.transaction.update({
    where: { id },
    data: { description, categoryId, walletId, value, type, date },
  });
}

export async function deleteTransaction(id: string) {
  await prisma.transaction.delete({ where: { id } });
}

export async function getTransactionChart(
  userId: string,
  period: string,
  month?: number | null,
  year?: number | null,
) {
  const dateFilter = year
    ? month
      ? {
          date: {
            gte: new Date(Number(year), Number(month) - 1, 1),
            lte: new Date(Number(year), Number(month), 0, 23, 59, 59),
          },
        }
      : {
          date: {
            gte: new Date(Number(year), 0, 1),
            lte: new Date(Number(year), 11, 31, 23, 59, 59),
          },
        }
    : {};

  const transactions = await prisma.transaction.findMany({
    where: { userId, ...dateFilter },
    select: { value: true, type: true, date: true },
    orderBy: { date: "asc" },
  });

  if (period === "week") {
    const weeklyData: Record<string, { income: number; expense: number }> = {};
    for (const t of transactions) {
      const date = new Date(t.date);
      const week = Math.ceil(date.getDate() / 7);
      const key = `Semana ${week}`;
      if (!weeklyData[key]) weeklyData[key] = { income: 0, expense: 0 };
      weeklyData[key][t.type === "income" ? "income" : "expense"] += t.value;
    }
    return ["Semana 1", "Semana 2", "Semana 3", "Semana 4"].map((week) => ({
      week,
      income: weeklyData[week]?.income || 0,
      expense: weeklyData[week]?.expense || 0,
    }));
  }

  const monthNames = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];

  const monthlyData: Record<string, { income: number; expense: number }> = {};
  for (const t of transactions) {
    const date = new Date(t.date);
    const monthKey = monthNames[date.getMonth()];
    if (!monthlyData[monthKey]) monthlyData[monthKey] = { income: 0, expense: 0 };
    monthlyData[monthKey][t.type === "income" ? "income" : "expense"] += t.value;
  }

  return monthNames.map((m) => ({
    month: m,
    income: monthlyData[m]?.income || 0,
    expense: monthlyData[m]?.expense || 0,
  }));
}
