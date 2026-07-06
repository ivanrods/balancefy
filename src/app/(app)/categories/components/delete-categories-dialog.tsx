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

import { useCategoriesMutations } from "@/hooks/use-categories";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/use-translation";

type DeleteCategoriesDialogProps = {
  id: string;
};

export function DeleteCategoriesDialog({ id }: DeleteCategoriesDialogProps) {
  const { deleteCategory } = useCategoriesMutations();
  const { t } = useTranslation();

  function handleDelete() {
    deleteCategory.mutate(id, {
      onSuccess: () => {
        toast.success(t("category.deleted"));
      },
      onError: () => {
        toast.error(t("category.deleteError"));
      },
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
          className="text-primary"
        >
          {t("category.deleteTitle")}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("category.deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("category.deleteDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("category.cancel")}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              onClick={handleDelete}
              className="bg-destructive text-white px-4 py-2 rounded-md"
            >
              {t("category.deleteConfirm")}
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
