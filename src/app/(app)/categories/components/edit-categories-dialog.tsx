"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
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
import { useCategoriesMutations } from "@/hooks/use-categories";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CategoriesFormData, categoriesSchema } from "@/lib/schemas/categories-schema";
import { Categories } from "@/types/categories";
import { SliderColor } from "./slider-color";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type EditCategoriesDialogProps = {
  categories: Categories;
};

export function EditCategoriesDialog({ categories }: EditCategoriesDialogProps) {
  const { updateCategory } = useCategoriesMutations();
  const { t } = useTranslation();

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
    updateCategory.mutate(
      {
        id: categories.id,
        name: formData.name,
        color: formData.color,
      },
      {
        onSuccess: () => {
          toast.success(t("category.editSuccess"));
        },
        onError: () => {
          toast.error(t("category.editError"));
        },
      },
    );
  }

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            {t("category.editTitle")}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("category.editTitle")}</DialogTitle>
            <DialogDescription>{t("category.editDescription")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label htmlFor="description">{t("category.name")}</Label>
            <Input id="name" {...register("name")} disabled={isSubmitting} />
            {errors.name && <span className="text-destructive text-sm">{errors.name.message}</span>}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="color">{t("category.color")}</Label>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <>
                  <SliderColor value={field.value} onValueChange={field.onChange} />
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
              <Button variant="outline">{t("category.cancel")}</Button>
            </DialogClose>
            <Button onClick={handleSubmit(onSubmit)} type="submit">
              {t("category.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
