"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SelectDialog } from "./select-dialog";
import { RadioGroupDemo } from "./radio-group-dialog";

import { DatePicker } from "./date-picker";
import { Transaction } from "@/types/transaction";

import { useTransactions } from "@/hooks/use-transactions";

type EditTransactionDialogProps = {
  transaction: Transaction;
};

export function EditTransactionDialog({
  transaction,
}: EditTransactionDialogProps) {
  console.log(transaction, "ok");
  const { updateTransaction } = useTransactions();

  const [descricao, setDescricao] = React.useState(transaction.descricao);
  const [categoria, setCategoria] = React.useState<Transaction["categoria"]>(
    transaction.categoria
  );
  const [valor, setValor] = React.useState(transaction.valor || "");
  const [tipo, setTipo] = React.useState<Transaction["tipo"]>(transaction.tipo);
  const [data, setData] = React.useState<Date | null>(
    transaction.data ? new Date(transaction.data) : null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateTransaction.mutate({
      id: transaction.id,
      descricao,
      valor: Number(valor),
      categoria,
      tipo,
      data: data ? data.toISOString() : new Date().toISOString(),
    });
  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <button>Editar transação</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Transação</DialogTitle>
            <DialogDescription>
              Preencha todo o formulário com informações da transação.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                name="name"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-4 ">
              <SelectDialog value={categoria} onValueChange={setCategoria} />
              <DatePicker value={data} onChange={setData} />
            </div>

            <RadioGroupDemo value={tipo} onValueChange={setTipo} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSubmit} type="submit">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
