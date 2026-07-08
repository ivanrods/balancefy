import { useTransactions } from "@/hooks/use-transactions";
import { Transaction } from "@/types/transaction";

export function useSummaryReportAll(initialTransactions?: Transaction[]) {
  const { transactions, isLoading } = useTransactions(undefined, initialTransactions);

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
