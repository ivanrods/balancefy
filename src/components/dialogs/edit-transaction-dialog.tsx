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

import { SelectDialog } from "./components/select-dialog";
import { RadioGroupDemo } from "./components/radio-group-dialog";

import { DateDialog } from "./components/date-dialog";
import { Transaction } from "@/types/transaction";

import { Controller } from "react-hook-form";
import { useTransactions } from "@/hooks/use-transactions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transactionSchema,
  TransactionFormData,
} from "@/lib/schemas/transaction";
import { toast } from "sonner";

type EditTransactionDialogProps = {
  transaction: Transaction;
};

export function EditTransactionDialog({
  transaction,
}: EditTransactionDialogProps) {
  const { updateTransaction } = useTransactions();
  const [categories, setCategories] = React.useState<
    { id: string; name: string }[]
  >([]);

  React.useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: transaction.description,
      value: transaction.value,
      categoryId: transaction.categoryId,
      type: transaction.type,
      date: new Date(transaction.date),
    },
  });

  function onSubmit(formData: TransactionFormData) {
    updateTransaction.mutate(
      {
        id: transaction.id,
        description: formData.description,
        value: Number(formData.value),
        date: formData.date.toISOString(),
        categoryId: formData.categoryId,
      },
      {
        onSuccess: () => {
          toast("Transação editada com sucesso!");
        },
        onError: () => {
          toast("Erro ao editar transação");
        },
      }
    );
  }

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <p>Editar Transação</p>
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
              <Input id="descricao" {...register("description")} />
              {errors.description && (
                <span className="text-destructive text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                {...register("value", { valueAsNumber: true })}
              />
              {errors.value && (
                <span className="text-destructive text-sm">
                  {errors.value.message}
                </span>
              )}
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <SelectDialog
                    value={field.value}
                    onValueChange={field.onChange}
                    categories={categories}
                  />
                )}
              />
              {errors.categoryId && (
                <span className="text-destructive text-sm">
                  {errors.categoryId.message}
                </span>
              )}

              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DateDialog value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.date && (
                <span className="text-destructive text-sm">
                  {errors.date.message}
                </span>
              )}
            </div>

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <RadioGroupDemo
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
            {errors.type && (
              <span className="text-destructive text-sm">
                {errors.type.message}
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
