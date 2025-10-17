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

import { useCategories } from "@/hooks/use-categories";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type DeleteCategoriesDialogProps = {
  id: string;
};
export function DeleteCategoriesDialog({ id }: DeleteCategoriesDialogProps) {
  const { deleteCategories } = useCategories();

  function handleDeleteCategories(id: string) {
    deleteCategories.mutate(id, {
      onSuccess: () => {
        toast.success("Categoria apagada com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao apagar categoria!");
      },
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            // Impede o Dropdown de fechar
            e.preventDefault();
          }}
          className="text-primary"
        >
          Excluir Transação
        </DropdownMenuItem>
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
              onClick={() => handleDeleteCategories(id)}
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
