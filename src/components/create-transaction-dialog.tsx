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

import { Controller } from "react-hook-form";
import { useTransactions } from "@/hooks/use-transactions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transactionSchema,
  TransactionFormData,
} from "@/lib/schemas/transaction";

export function TransactionDialog() {
  const { createTransaction } = useTransactions();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      descricao: "",
      valor: 0,
      categoria: "Outros",
      tipo: "entrada",
      data: new Date(),
    },
  });

  function onSubmit(formData: TransactionFormData) {
    createTransaction.mutate({
      ...formData,
      valor: Number(formData.valor),
      data: formData.data
        ? formData.data.toISOString()
        : new Date().toISOString(),
    });

    reset();
  }

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
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
