import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useWalletsMutations } from "@/hooks/use-wallets";
import { useTranslation } from "@/hooks/use-translation";

type DeleteWalletDialogProps = {
  id: string;
};
export function DeleteWalletDialog({ id }: DeleteWalletDialogProps) {
  const { deleteWallet } = useWalletsMutations();
  const { t } = useTranslation();

  function handleDeleteWallet(id: string) {
    deleteWallet.mutate(id, {
      onSuccess: () => {
        toast.success(t("wallet.deleted"));
      },
      onError: () => {
        toast.error(t("wallet.deleteError"));
      },
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link">{t("wallet.deleteTitle")}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("wallet.deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription>{t("wallet.deleteDescription")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("wallet.cancel")}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              onClick={() => handleDeleteWallet(id)}
              className="bg-destructive text-white px-4 py-2 rounded-md"
            >
              {t("wallet.deleteConfirm")}
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
