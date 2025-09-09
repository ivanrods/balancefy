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
import { Plus } from "lucide-react";

import { SelectDialog } from "./select-dialog";
import { RadioGroupDemo } from "./radio-group-dialog";

import { DatePicker } from "./date-picker";
import { Transaction } from "@/types/transaction";

import { useTransactions } from "@/hooks/use-transactions";

export function TransactionDialog() {
  const { createTransaction } = useTransactions();

  const [descricao, setDescricao] = React.useState("");
  const [categoria, setCategoria] =
    React.useState<Transaction["categoria"]>("Alimentação");
  const [valor, setValor] = React.useState("");
  const [tipo, setTipo] = React.useState<Transaction["tipo"]>("entrada");
  const [data, setData] = React.useState<Date | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createTransaction.mutate({
      descricao,
      categoria,
      valor: Number(valor),
      tipo,
      data: data ? data.toISOString() : new Date().toISOString(),
    });

    // Resetar campos
    setDescricao("");
    setValor("");
    setCategoria("Alimentação");
    setTipo("entrada");
    setData(null);
  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> <p className="hidden md:block ">Nova Transação</p>
          </Button>
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
                name="number"
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
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
