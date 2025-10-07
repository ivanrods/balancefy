import { useTransactions } from "@/hooks/use-transactions";

export function useSummaryAll() {
  const { transactions } = useTransactions();

  const incomeAll =
    transactions
      ?.filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.value, 0) ?? 0;

  const expenseAll =
    transactions
      ?.filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.value, 0) ?? 0;

  const balanceAll = incomeAll - expenseAll;
  const economyAll = balanceAll > 0 ? balanceAll : 0;

  return { incomeAll, expenseAll, balanceAll, economyAll };
}
