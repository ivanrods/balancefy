import { useTransactionsQuery } from "@/hooks/use-transactions";
import { usePeriod } from "@/context/period-context";
import { useTranslation } from "@/hooks/use-translation";
import { Transaction } from "@/types/transaction";

export function useSummaryMonth(initialTransactions?: Transaction[]) {
  const { selectedMonth } = usePeriod();
  const { locale } = useTranslation();
  const year = new Date().getFullYear();

  const { data: transactions, isLoading } = useTransactionsQuery({ month: selectedMonth, year }, initialTransactions);

  const monthNames = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return date.toLocaleDateString(locale, { month: "long" });
  });
  const dateToday =
    monthNames[selectedMonth - 1] ?? monthNames[new Date().getMonth()];

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

  return { incomeMonth, expenseMonth, balanceMonth, economyMonth, dateToday, isLoading };
}
