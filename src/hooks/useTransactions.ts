import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  createdAt: string;
};

export function useTransactions() {
  const queryClient = useQueryClient();

  // GET
  const { data, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await fetch("/api/transactions");
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
    deleteTransaction,
  };
}
