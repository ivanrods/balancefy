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
import { useWalllets } from "@/hooks/use-wallets";

type DeleteWalletDialogProps = {
  id: string;
};
export function DeleteWalletDialog({ id }: DeleteWalletDialogProps) {
  const { deleteWallets } = useWalllets();

  function handleDeleteWallet(id: string) {
    deleteWallets.mutate(id, {
      onSuccess: () => {
        toast.success("Carteira apagada com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao apagar carteira!");
      },
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="link">Excluir</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente sua
            carteira e as transações relacionadas a ela.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              onClick={() => handleDeleteWallet(id)}
              className="bg-destructive text-white px-4 py-2 rounded-md"
            >
              Continue
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
