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
import { useWalllets } from "@/hooks/use-wallets";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { WalletsFormData, walletSchema } from "@/lib/schemas/wallet-schema";

type EditWalletsDialog = {
  wallets: { id: string; name: string };
};

export function EditWalletDialog({ wallets }: EditWalletsDialog) {
  const { updateWallets } = useWalllets();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WalletsFormData>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: wallets.name,
    },
  });

  function onSubmit(formData: WalletsFormData) {
    updateWallets.mutate(
      {
        id: wallets.id,
        name: formData.name,
      },
      {
        onSuccess: () => {
          toast.success(t("wallet.editSuccess"));
        },
        onError: () => {
          toast.error(t("wallet.editError"));
        },
      }
    );
  }

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button variant="outline">{t("wallet.editTitle")}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("wallet.editTitle")}</DialogTitle>
            <DialogDescription>
              {t("wallet.editDescription")}
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
              {t("wallet.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
