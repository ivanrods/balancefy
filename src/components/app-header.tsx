import { SidebarTrigger } from "./ui/sidebar";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { ButtonTheme } from "./button-theme";
import { TransactionDialog } from "./create-transaction-dialog";
import DynamicBreadcrumb from "./dynamic-breadcrumb";

export function AppHeader() {
  return (
    <header className=" flex items-center gap-4 p-4 border-b">
      <SidebarTrigger />

      <DynamicBreadcrumb />

      <Input placeholder="Buscar transação" />

      <TransactionDialog />
      <ButtonTheme />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-muted transition rounded-full">
            <Bell />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="p-2 m-2">
            <DropdownMenuItem>Saldo atualizado</DropdownMenuItem>
            <DropdownMenuItem>Transação concluída</DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
