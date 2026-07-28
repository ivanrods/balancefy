import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Categories } from "@/types/categories";

type UseCategoriesProps = { month?: number; year?: number };

async function fetchCategories(props?: UseCategoriesProps) {
  const params = new URLSearchParams({ type: "summary" });
  if (props?.month && props?.year) {
    params.set("month", String(props.month));
    params.set("year", String(props.year));
  }

  const res = await fetch(`/api/categories?${params}`);
  if (!res.ok) throw new Error("Erro ao buscar categorias");
  return res.json();
}

export function useCategoriesQuery(props?: UseCategoriesProps, initialData?: Categories[]) {
  return useQuery<Categories[]>({
    queryKey: ["categories", props?.month, props?.year],
    queryFn: () => fetchCategories(props),
    initialData: !props?.month ? initialData : undefined,
  });
}

export function useCategoriesMutations() {
  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: async (data: Pick<Categories, "name" | "color">) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erro ao criar categoria");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async (data: Pick<Categories, "id" | "name" | "color">) => {
      const res = await fetch(`/api/categories/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erro ao atualizar categoria");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar categoria");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { createCategory, updateCategory, deleteCategory };
}
