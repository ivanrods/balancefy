import { useTransactions } from "@/hooks/use-transactions";

export function useSummary() {
  const { transactions } = useTransactions();

  const income =
    transactions
      ?.filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.value, 0) ?? 0;

  const expense =
    transactions
      ?.filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.value, 0) ?? 0;

  const balance = income - expense;
  const economy = balance > 0 ? balance : 0;

  return { income, expense, balance, economy };
}
