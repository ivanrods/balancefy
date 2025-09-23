import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CategoriesPage() {
  const categorias = [
    { id: 1, nome: "Alimantação", relationship: "", value: 200.9, number: 3 },
    { id: 2, nome: "Moradia", relationship: "", value: 200.9, number: 3 },
    { id: 3, nome: "Ganhos", relationship: "", value: 200.9, number: 3 },
  ];
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
          {categorias.map((cat) => (
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
