import { useTransactions } from "@/hooks/use-transactions";

export function useSummary() {
  const { transactions } = useTransactions();

  const entradas =
    transactions
      ?.filter((t) => t.tipo === "entrada")
      .reduce((acc, t) => acc + t.valor, 0) ?? 0;

  const saidas =
    transactions
      ?.filter((t) => t.tipo === "saida")
      .reduce((acc, t) => acc + t.valor, 0) ?? 0;

  const saldo = entradas - saidas;
  const economia = saldo > 0 ? saldo : 0;

  return { entradas, saidas, saldo, economia };
}
