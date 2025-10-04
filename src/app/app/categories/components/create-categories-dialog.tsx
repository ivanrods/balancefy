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
import { useCategories } from "@/hooks/use-categories";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  CategoriesFormData,
  categoriesSchema,
} from "@/lib/schemas/categories-schema";
import { SliderColor } from "./slider-color";

export function CategoriesDialog() {
  const { createCategories } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoriesFormData>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      name: "",
      color: "#cccccc",
    },
  });

  function onSubmit(formData: CategoriesFormData) {
    createCategories.mutate(
      {
        name: formData.name,
        color: formData.color,
      },
      {
        onSuccess: () => {
          toast.success("Categoria criada");
        },
        onError: () => {
          toast.error("Erro ao criar categoria");
        },
      }
    );

    reset();
  }

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> <p className="hidden md:block ">Nova Categoria</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Categoria</DialogTitle>
            <DialogDescription>
              Preencha todo o formulário com informações da categoria.
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
