"use client";

import { EditCategoriesDialog } from "@/components/dialogs/edit-categories-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/hooks/use-categories";

import { formatCurrency } from "@/utils/format-currency";
import { ArrowLeftRight, Circle, PaintBucket } from "lucide-react";
import { toast } from "sonner";

export default function CategoriesTable() {
  const { categories, deleteCategories, isLoading } = useCategories();

  function handleDeleteCategories(id: string) {
    deleteCategories.mutate(id, {
      onSuccess: () => {
        toast.success("Categoria apagada com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao apagar categoria!");
      },
    });
  }

  if (isLoading) {
    return <Skeleton className="w-full h-96 rounded-xl" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Transações relacionadas</TableHead>
          <TableHead>Cor</TableHead>
          <TableHead>Valor das transações</TableHead>
          <TableHead>Numero de transações</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {categories.map((cat) => (
          <TableRow key={cat.id}>
            <TableCell>{cat.name}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ArrowLeftRight size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>Transações relacionadas</DropdownMenuLabel>

                  {cat.relationship.map((t, i) => (
                    <DropdownMenuItem key={i}>{t}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            <TableCell>
              <Circle color={cat.color} fill={cat.color} />
            </TableCell>
            <TableCell>{formatCurrency(cat.value)}</TableCell>
            <TableCell>{cat.number}</TableCell>
            <TableCell className="flex gap-2">
              <EditCategoriesDialog categories={cat} />
              <Button
                onClick={() => handleDeleteCategories(cat.id)}
                variant="destructive"
              >
                Excluir
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
