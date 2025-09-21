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
import { Trash } from "lucide-react";
import { toast } from "sonner";
export function DeleteAccountDialog() {
  async function handleDeleteAccount() {
    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao excluir conta");
      }
      const data = await res.json();
      toast.success(data.message || "Conta excluída com sucesso!");
      window.location.href = "/login";
    } catch (err) {
      toast.error("Erro ao excluir conta");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex gap-2">
        <Trash className="w-4 h-4 mr-2 text-destructive" />
        Deletar conta
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente sua
            conta e removerá seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              onClick={handleDeleteAccount}
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
