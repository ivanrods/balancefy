"use client";
import { ChartPieDonut } from "@/components/chart-pie-donut";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Categories } from "@/types/categories";
import { formatCurrency } from "@/utils/format-currency";
import { ArrowLeftRight } from "lucide-react";

import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categories[]>([]);

  useEffect(() => {
    fetch("/api/categories?type=summary")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 px-4">
      <h1 className="text-2xl font-bold">Categorias</h1>
      <div className="w-full flex flex-col xl:flex-row-reverse gap-4 ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Transações relacionadas</TableHead>
              <TableHead>Valor das transações</TableHead>
              <TableHead>Numero de transações</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.nome}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ArrowLeftRight size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      <DropdownMenuLabel>
                        Transações relacionadas
                      </DropdownMenuLabel>

                      {cat.relationship.map((t, i) => (
                        <DropdownMenuItem key={i}>{t}</DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>{formatCurrency(cat.value)}</TableCell>
                <TableCell>{cat.number}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline">Editar</Button>
                  <Button variant="destructive">Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ChartPieDonut />
      </div>
    </div>
  );
}
