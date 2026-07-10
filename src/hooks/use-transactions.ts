import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@/types/transaction";

type UseTransactionsProps = {
  month?: number;
  year?: number;
};

async function fetchTransactions(props?: UseTransactionsProps) {
  const params = new URLSearchParams();
  const currentYear = new Date().getFullYear();
  const hasMonth = typeof props?.month === "number";
  const hasYear = typeof props?.year === "number";

  if (hasMonth) params.set("month", String(props!.month));
  if (hasMonth || hasYear)
    params.set("year", String(props?.year ?? currentYear));

  const queryString = params.toString();
  const url = queryString
    ? `/api/transactions?${queryString}`
    : "/api/transactions";

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar transações");
  return res.json();
}

export function useTransactionsQuery(
  props?: UseTransactionsProps,
  initialData?: Transaction[],
) {
  return useQuery<Transaction[]>({
    queryKey: ["transactions", { month: props?.month, year: props?.year }],
    queryFn: () => fetchTransactions(props),
    initialData: !props?.month ? initialData : undefined,
  });
}

export function useTransactionsMutations() {
  const queryClient = useQueryClient();

  const createTransaction = useMutation({
    mutationFn: async (
      transaction: Omit<
        Transaction,
        "id" | "createdAt" | "category" | "wallet"
      >,
    ) => {
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
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async (
      transaction: Omit<Transaction, "createdAt" | "category" | "wallet">,
    ) => {
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
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar transação");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { createTransaction, updateTransaction, deleteTransaction };
}

// API compatível retroativa — não quebra consumers existentes
export function useTransactions(
  props?: UseTransactionsProps,
  initialData?: Transaction[],
) {
  const query = useTransactionsQuery(props, initialData);
  const mutations = useTransactionsMutations();

  return {
    transactions: query.data,
    isLoading: query.isLoading,
    error: query.error,
    ...mutations,
  };
}
