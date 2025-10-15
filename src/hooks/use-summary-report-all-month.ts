import { useTransactions } from "@/hooks/use-transactions";

export function useSummaryReportMonth() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { transactions } = useTransactions({ month, year });

  const dateToday = new Date().toLocaleString("pt-BR", { month: "long" });

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
