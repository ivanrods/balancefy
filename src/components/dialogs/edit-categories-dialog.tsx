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
import { useCategories } from "@/hooks/use-categories";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CategoriesFormData, categoriesSchema } from "@/lib/schemas/categories";
import { Categories } from "@/types/categories";
import { SliderColor } from "./components/slider-color";

type EditCategoriesDialog = {
  categories: Categories;
};

export function EditCategoriesDialog({ categories }: EditCategoriesDialog) {
  const { updateCategories } = useCategories();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoriesFormData>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      name: categories.name,
      color: categories.color,
    },
  });

  function onSubmit(formData: CategoriesFormData) {
    updateCategories.mutate(
      {
        id: categories.id,
        name: formData.name,
        color: formData.color,
      },
      {
        onSuccess: () => {
          toast.success("Categoria atualizada");
        },
        onError: () => {
          toast.error("Erro ao atualizar categoria");
        },
      }
    );
  }

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button variant="outline">Editar</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
              Preencha todo o formulário com novas informações da categoria.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label htmlFor="description">Nome da categoria</Label>
            <Input id="name" {...register("name")} disabled={isSubmitting} />
            {errors.name && (
              <span className="text-destructive text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="color">Selecione a cor</Label>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <>
                  <SliderColor
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                  <div
                    className="w-6 h-6 rounded-full border mt-2"
                    style={{ backgroundColor: field.value }}
                  />
                </>
              )}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSubmit(onSubmit)} type="submit">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
