import { useTransactions } from "@/hooks/use-transactions";

export function useSummaryReportAll() {
  const { transactions, isLoading } = useTransactions();

  const incomeAll =
    transactions
      ?.filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.value, 0) ?? 0;

  const expenseAll =
    transactions
      ?.filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.value, 0) ?? 0;

  const balanceAll = incomeAll - expenseAll;

  return { incomeAll, expenseAll, balanceAll, isLoading };
}
