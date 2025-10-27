import { useQuery } from "@tanstack/react-query";
import { TransactionType } from "@/types/transaction";

type UseTransactionsProps = {
  month?: number;
  year?: number;
};

export function useTransactionsType({
  month,
  year,
}: UseTransactionsProps = {}) {
  // GET
  const queryKey = ["transactions-type", { month, year }];

  const { data, isLoading, error } = useQuery<TransactionType[]>({
    queryKey,
    queryFn: async () => {
      let url = "/api/transactions/transaction-type";

      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro ao buscar transações");
      return res.json();
    },
  });

  return {
    transactionsType: data,
    isLoading,
    error,
  };
}
