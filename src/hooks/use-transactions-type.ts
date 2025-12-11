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
      params.append("period", period);
      if (month) params.append("month", month.toString());
      if (year) params.append("year", year.toString());

      const res = await fetch(`/api/transactions/transaction-type?${params}`);
      if (!res.ok) throw new Error("Erro ao buscar transações");
      return res.json();
    },
  });

  return { transactionsType: data, isLoading, error };
}
