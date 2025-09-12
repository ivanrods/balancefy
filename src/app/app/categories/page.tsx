import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TransactionsPage() {
  const categorias = [
    { id: 1, nome: "Alimantação", tipo: "Saída", cor: "red" },
    { id: 2, nome: "Moradia", tipo: "Saída", cor: "green" },
    { id: 3, nome: "Ganhos", tipo: "Entrada", cor: "blue" },
  ];
  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Categorias</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categorias.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>{cat.nome}</TableCell>
              <TableCell>{cat.tipo}</TableCell>
              <TableCell>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: cat.cor }}
                />
              </TableCell>
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
