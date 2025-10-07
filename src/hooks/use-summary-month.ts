import { useTransactions } from "@/hooks/use-transactions";

export function useSummaryMonth() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { transactions } = useTransactions({ month, year });
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

  return { incomeMonth, expenseMonth, balanceMonth, economyMonth };
}
