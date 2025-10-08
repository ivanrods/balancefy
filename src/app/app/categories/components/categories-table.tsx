"use client";

import { DeleteCategoriesDialog } from "@/app/app/categories/components/delete-categories-dialog";
import { EditCategoriesDialog } from "./edit-categories-dialog";

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
import { ArrowLeftRight, Circle } from "lucide-react";
import { usePeriod } from "@/context/period-context";

export default function CategoriesTable() {
  const { mode } = usePeriod();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { categories, isLoading } = useCategories(
    mode === "month" ? { month, year } : undefined
  );

  if (isLoading) {
    return <Skeleton className="w-full h-96 rounded-xl" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Transações </TableHead>
          <TableHead>Cor</TableHead>
          <TableHead>Valor </TableHead>
          <TableHead>Quantidade</TableHead>
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
            <TableCell className="flex justify-start gap-2">
              <EditCategoriesDialog categories={cat} />
              <DeleteCategoriesDialog id={cat.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
