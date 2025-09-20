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
import { SelectDialog } from "./components/select-dialog";
import { RadioGroupDemo } from "./components/radio-group-dialog";
import { DateDialog } from "./components/date-dialog";

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
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      value: 0,
      categoryId: "",
      type: "income",
      date: new Date(),
    },
  });

  function onSubmit(formData: TransactionFormData) {
    createTransaction.mutate({
      description: formData.description,
      value: Number(formData.value),
      type: formData.type,
      date: formData.date.toISOString(),
      categoryId: formData.categoryId,
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
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" {...register("description")} />
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
