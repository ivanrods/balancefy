import { useTransactions } from "@/hooks/use-transactions";
import { usePeriod } from "@/context/period-context";
import { Transaction } from "@/types/transaction";

export function useSummaryReportMonth(initialTransactions?: Transaction[]) {
  const { selectedMonth } = usePeriod();
  const now = new Date();
  const year = now.getFullYear();

  const { transactions } = useTransactions({ month: selectedMonth, year }, initialTransactions);

  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
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

  return { incomeMonth, expenseMonth, balanceMonth, dateToday };
}
