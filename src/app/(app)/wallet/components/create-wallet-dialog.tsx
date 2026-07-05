"use client";

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
import { WalletsFormData, walletSchema } from "@/lib/schemas/wallet-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useWalletsMutations } from "@/hooks/use-wallets";

export function WalletDialog() {
  const { createWallet } = useWalletsMutations();
  const { t } = useTranslation();

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
    createWallet.mutate(
      {
        name: formData.name,
      },
      {
        onSuccess: () => {
          toast.success(t("wallet.success"));
        },
        onError: () => {
          toast.error(t("wallet.error"));
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
            <Plus /> {t("wallet.newWallet")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("wallet.addTitle")}</DialogTitle>
            <DialogDescription>
              {t("wallet.addDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label htmlFor="description">{t("wallet.name")}</Label>
            <Input id="name" {...register("name")} disabled={isSubmitting} />
            {errors.name && (
              <span className="text-destructive text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("wallet.cancel")}</Button>
            </DialogClose>
            <Button onClick={handleSubmit(onSubmit)} type="submit">
              {t("wallet.add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
