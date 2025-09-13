"use client";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  return (
    <header className=" flex items-center justify-between gap-4 py-4 border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger />

        <DynamicBreadcrumb />
      </div>

      {(pathname === "/app/transactions" || pathname === "/app/dashboard") && (
        <Input placeholder="Buscar transação" />
      )}

      {(pathname === "/app/transactions" || pathname === "/app/dashboard") && (
        <TransactionDialog />
      )}
      <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
}
