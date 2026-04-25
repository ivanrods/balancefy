import { useQuery } from "@tanstack/react-query";
import { TransactionType } from "@/types/transaction";

type UseTransactionsProps = {
  month?: number;
  year?: number;
  period?: "month" | "week";
};

export function useTransactionsType({
  month,
  year,
  period = "month",
}: UseTransactionsProps = {}) {
  const queryKey = ["transactions-type", { month, year, period }];

  const { data, isLoading, error } = useQuery<TransactionType[]>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      const currentYear = new Date().getFullYear();
      const hasMonth = typeof month === "number";
      const hasYear = typeof year === "number";

      params.append("period", period);

      if (hasMonth) {
        params.append("month", month.toString());
      }

      if (hasMonth || hasYear) {
        params.append("year", String(year ?? currentYear));
      }

      const res = await fetch(`/api/transactions/transaction-type?${params}`);
      if (!res.ok) throw new Error("Erro ao buscar transações");
      return res.json();
    },
  });

  return { transactionsType: data, isLoading, error };
}
