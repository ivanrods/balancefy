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
import { WalletsFormData, walletSchema } from "@/lib/schemas/wallet-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useWalllets } from "@/hooks/use-wallets";

export function WalletDialog() {
  const { createWallets } = useWalllets();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WalletsFormData>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(formData: WalletsFormData) {
    createWallets.mutate(
      {
        name: formData.name,
      },
      {
        onSuccess: () => {
          toast.success("Cartaira criada");
        },
        onError: () => {
          toast.error("Erro ao criar carteira");
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
            <Plus /> <p className="hidden md:block ">Nova Carteira</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Carteira</DialogTitle>
            <DialogDescription>
              Preencha todo o formulário com informações da carteira.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label htmlFor="description">Nome da carteira</Label>
            <Input id="name" {...register("name")} disabled={isSubmitting} />
            {errors.name && (
              <span className="text-destructive text-sm">
                {errors.name.message}
              </span>
            )}
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
