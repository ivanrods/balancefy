import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@/types/transaction";

type UseTransactionsProps = {
  month?: number;
  year?: number;
};

export function useTransactions({ month, year }: UseTransactionsProps = {}) {
  const queryClient = useQueryClient();

  // GET

  const queryKey = ["transactions", { month, year }];

  const { data, isLoading, error } = useQuery<Transaction[]>({
    queryKey,
    queryFn: async () => {
      let url = "/api/transactions";

      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro ao buscar transações");
      return res.json();
    },
  });

  // CREATE
  const createTransaction = useMutation({
    mutationFn: async (transaction: Omit<Transaction, "id" | "createdAt">) => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify(transaction),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erro ao criar transação");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  //UPDATE
  const updateTransaction = useMutation({
    mutationFn: async (transaction: Transaction) => {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: "PUT",
        body: JSON.stringify(transaction),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erro ao atualizar transação");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  // DELETE
  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar transação");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return {
    transactions: data,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
