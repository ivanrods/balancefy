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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useTranslation } from "@/hooks/use-translation";

export function DeleteAccountDialog() {
  const { t } = useTranslation();

  async function handleDeleteAccount() {
    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || t("deleteAccount.error"));
      }
      const data = await res.json();
      toast.success(data.message || t("deleteAccount.success"));
      signOut({ callbackUrl: "/login" });
    } catch (err) {
      toast.error(t("deleteAccount.error"));
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Trash className="w-4 h-4 mr-2 text-destructive" />
          {t("nav.deleteAccount")}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteAccount.title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("deleteAccount.description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("deleteAccount.cancel")}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              onClick={handleDeleteAccount}
              className="bg-destructive text-white px-4 py-2 rounded-md"
            >
              {t("deleteAccount.confirm")}
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
