import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Categories } from "@/types/categories";

type UseCategoriesProps = { month?: number; year?: number };

export function useCategories({ month, year }: UseCategoriesProps = {}) {
  const queryClient = useQueryClient();

  // GET
  const queryString =
    month && year
      ? `?type=summary&month=${month}&year=${year}`
      : `?type=summary`;

  const { data, isLoading, error } = useQuery<Categories[]>({
    queryKey: ["categories", month, year],
    queryFn: async () => {
      const res = await fetch(`/api/categories${queryString}`);
      if (!res.ok) throw new Error("Erro ao buscar transações");
      return res.json();
    },
  });

  // CREATE
  const createCategories = useMutation({
    mutationFn: async (categories: Omit<Categories, "id" | "createdAt">) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(categories),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erro ao criar categoria");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  //UPDATE
  const updateCategories = useMutation({
    mutationFn: async (
      categories: Pick<Categories, "id" | "name" | "color">
    ) => {
      const res = await fetch(`/api/categories/${categories.id}`, {
        method: "PUT",
        body: JSON.stringify(categories),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erro ao atualizar categoria");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // DELETE
  const deleteCategories = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar categoria");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    categories: data ?? [],
    isLoading,
    error,
    createCategories,
    updateCategories,
    deleteCategories,
  };
}
