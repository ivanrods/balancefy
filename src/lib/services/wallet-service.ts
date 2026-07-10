import { prisma } from "@/lib/prisma";
import type { Wallets } from "@/types/wallet";

type WalletSummaryParams = {
  userId: string;
  month?: number | null;
  year?: number | null;
};

export async function getWalletsSummary({
  userId,
  month,
  year,
}: WalletSummaryParams): Promise<Wallets[]> {
  const hasMonthFilter = month != null;
  const yearNum = year ?? new Date().getFullYear();
  const startDate = hasMonthFilter
    ? new Date(yearNum, month! - 1, 1)
    : new Date(0);
  const endDate = hasMonthFilter
    ? new Date(yearNum, month!, 0, 23, 59, 59, 999)
    : new Date();

  const wallets = await prisma.wallet.findMany({
    where: { userId },
    include: {
      transactions: {
        orderBy: { date: "desc" },
        take: 1,
        select: { value: true, date: true, type: true },
      },
    },
  });

  const walletIds = wallets.map((w) => w.id);

  const [periodTotals, allTimeTotals] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["walletId", "type"],
      where: { walletId: { in: walletIds }, date: { gte: startDate, lte: endDate } },
      _sum: { value: true },
    }),
    prisma.transaction.groupBy({
      by: ["walletId", "type"],
      where: { walletId: { in: walletIds } },
      _sum: { value: true },
    }),
  ]);

  const periodMap = new Map<string, { income: number; expense: number }>();
  const allTimeMap = new Map<string, { income: number; expense: number }>();

  for (const t of periodTotals) {
    const key = t.walletId;
    if (!periodMap.has(key)) periodMap.set(key, { income: 0, expense: 0 });
    const entry = periodMap.get(key)!;
    if (t.type === "income") entry.income += t._sum.value ?? 0;
    else entry.expense += t._sum.value ?? 0;
  }

  for (const t of allTimeTotals) {
    const key = t.walletId;
    if (!allTimeMap.has(key)) allTimeMap.set(key, { income: 0, expense: 0 });
    const entry = allTimeMap.get(key)!;
    if (t.type === "income") entry.income += t._sum.value ?? 0;
    else entry.expense += t._sum.value ?? 0;
  }

  return wallets.map((wallet) => {
    const period = periodMap.get(wallet.id) ?? { income: 0, expense: 0 };
    const allTime = allTimeMap.get(wallet.id) ?? { income: 0, expense: 0 };
    const lastTx = wallet.transactions[0] ?? null;

    return {
      id: wallet.id,
      name: wallet.name,
      totalIncome: period.income,
      totalExpense: period.expense,
      balance: hasMonthFilter
        ? period.income - period.expense
        : allTime.income - allTime.expense,
      lastTransaction: lastTx
        ? { amount: lastTx.value, date: lastTx.date.toISOString(), type: lastTx.type }
        : null,
    };
  });
}
