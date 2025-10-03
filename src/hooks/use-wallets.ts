import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Wallets } from "@/types/wallet";

export function useCategories() {
  const queryClient = useQueryClient();

  // GET
  const { data, isLoading, error } = useQuery<Wallets[]>({
    queryKey: ["wallets"],
    queryFn: async () => {
      const res = await fetch("/api/wallts?type=summary");
      if (!res.ok) throw new Error("Erro ao buscar carteiras");
      return res.json();
    },
  });

  // CREATE
  const createWallets = useMutation({
    mutationFn: async (wallets: Omit<Wallets, "id" | "createdAt">) => {
      const res = await fetch("/api/wallets", {
        method: "POST",
        body: JSON.stringify(wallets),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erro ao criar carteira");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  //UPDATE
  const updateWallets = useMutation({
    mutationFn: async (wallets: Pick<Wallets, "id" | "name">) => {
      const res = await fetch(`/api/wallets/${wallets.id}`, {
        method: "PUT",
        body: JSON.stringify(wallets),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erro ao atualizar carteira");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  // DELETE
  const deleteWallets = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/wallets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar carteira");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  return {
    wallets: data ?? [],
    isLoading,
    error,
    createWallets,
    updateWallets,
    deleteWallets,
  };
}
