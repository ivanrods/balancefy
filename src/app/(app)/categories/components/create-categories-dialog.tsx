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
import { Plus } from "lucide-react";
import { useCategoriesMutations } from "@/hooks/use-categories";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CategoriesFormData, categoriesSchema } from "@/lib/schemas/categories-schema";
import { SliderColor } from "./slider-color";

export function CategoriesDialog() {
  const { createCategory } = useCategoriesMutations();
  const { t } = useTranslation();

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
    createCategory.mutate(
      {
        name: formData.name,
        color: formData.color ?? "#cccccc",
      },
      {
        onSuccess: () => {
          toast.success(t("category.success"));
          reset();
        },
        onError: () => {
          toast.error(t("category.error"));
        },
      },
    );
  }

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> {t("category.newCategory")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("category.addTitle")}</DialogTitle>
            <DialogDescription>{t("category.addDescription")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label htmlFor="description">{t("category.name")}</Label>
            <Input id="name" {...register("name")} disabled={isSubmitting} />
            {errors.name && <span className="text-destructive text-sm">{errors.name.message}</span>}
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
