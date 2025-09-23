"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories?type=summary")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);
  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Categorias</h1>
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
              <TableCell>{cat.relationship}</TableCell>
              <TableCell>{cat.value}</TableCell>
              <TableCell>{cat.number}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline">Editar</Button>
                <Button variant="destructive">Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
