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

import { Controller } from "react-hook-form";
import { useTransactions } from "@/hooks/use-transactions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transactionSchema,
  TransactionFormData,
} from "@/lib/schemas/transaction";

type EditTransactionDialogProps = {
  transaction: Transaction;
};

export function EditTransactionDialog({
  transaction,
}: EditTransactionDialogProps) {
  const { updateTransaction } = useTransactions();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      descricao: transaction.descricao,
      valor: transaction.valor,
      categoria: transaction.categoria,
      tipo: transaction.tipo,
      data: new Date(transaction.data),
    },
  });

  const onSubmit = (formData: TransactionFormData) => {
    updateTransaction.mutate({
      ...formData,
      id: transaction.id,
      valor: Number(formData.valor),
      data: new Date().toISOString(),
    });
  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <p className="hidden md:block ">Editar Transação</p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
            <DialogDescription>
              Preencha todo o formulário com as novas informações da transação.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" {...register("descricao")} />
              {errors.descricao && (
                <span className="text-destructive text-sm">
                  {errors.descricao.message}
                </span>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                {...register("valor", { valueAsNumber: true })}
              />
              {errors.valor && (
                <span className="text-destructive text-sm">
                  {errors.valor.message}
                </span>
              )}
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Controller
                name="categoria"
                control={control}
                render={({ field }) => (
                  <SelectDialog
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
              {errors.categoria && (
                <span className="text-destructive text-sm">
                  {errors.categoria.message}
                </span>
              )}

              <Controller
                name="data"
                control={control}
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.data && (
                <span className="text-destructive text-sm">
                  {errors.data.message}
                </span>
              )}
            </div>

            <Controller
              name="tipo"
              control={control}
              render={({ field }) => (
                <RadioGroupDemo
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
            {errors.tipo && (
              <span className="text-destructive text-sm">
                {errors.tipo.message}
              </span>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              disabled={isSubmitting}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
