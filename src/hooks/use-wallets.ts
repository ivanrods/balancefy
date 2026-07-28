import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Wallets } from "@/types/wallet";

type UseWalletsProps = {
  month?: number;
  year?: number;
};

async function fetchWallets(props?: UseWalletsProps) {
  const params = new URLSearchParams({ type: "summary" });
  const currentYear = new Date().getFullYear();
  const hasMonth = typeof props?.month === "number";
  const hasYear = typeof props?.year === "number";

  if (hasMonth) {
    params.set("month", String(props!.month));
  }

  if (hasMonth || hasYear) {
    params.set("year", String(props?.year ?? currentYear));
  }

  const res = await fetch(`/api/wallets?${params}`);
  if (!res.ok) throw new Error("Erro ao buscar carteiras");
  return res.json();
}

export function useWalletsQuery(props?: UseWalletsProps, initialData?: Wallets[]) {
  return useQuery<Wallets[]>({
    queryKey: ["wallets", props?.month, props?.year],
    queryFn: () => fetchWallets(props),
    initialData: !props?.month ? initialData : undefined,
  });
}

export function useWalletsMutations() {
  const queryClient = useQueryClient();

  const createWallet = useMutation({
    mutationFn: async (data: Pick<Wallets, "name">) => {
      const res = await fetch("/api/wallets", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erro ao criar carteira");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  const updateWallet = useMutation({
    mutationFn: async (data: Pick<Wallets, "id" | "name">) => {
      const res = await fetch(`/api/wallets/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erro ao atualizar carteira");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  const deleteWallet = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/wallets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar carteira");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  return { createWallet, updateWallet, deleteWallet };
}
