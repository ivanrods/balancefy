import { useTransactionsQuery } from "@/hooks/use-transactions";
import { usePeriod } from "@/context/period-context";
import { Transaction } from "@/types/transaction";

export function useSummaryMonth(initialTransactions?: Transaction[]) {
  const { selectedMonth } = usePeriod();
  const year = new Date().getFullYear();

  const { data: transactions, isLoading } = useTransactionsQuery({ month: selectedMonth, year }, initialTransactions);

  const incomeMonth =
    transactions
      ?.filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.value, 0) ?? 0;

  const expenseMonth =
    transactions
      ?.filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.value, 0) ?? 0;

  const balanceMonth = incomeMonth - expenseMonth;
  const economyMonth = balanceMonth > 0 ? balanceMonth : 0;

  return { incomeMonth, expenseMonth, balanceMonth, economyMonth, isLoading };
}
