"use client";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { ButtonTheme } from "@/components/header/components/button-theme";

import DynamicBreadcrumb from "./components/dynamic-breadcrumb";
import { InputSearch } from "./components/input-search";
import { Notifications } from "./components/notifications";
import { CategoriesDialog } from "../../app/app/categories/components/create-categories-dialog";
import { WalletDialog } from "../../app/app/wallet/components/create-wallet-dialog";
import { TransactionDialog } from "@/app/app/transactions/components/create-transaction-dialog";

export function AppHeader() {
  const pathname = usePathname();
  return (
    <header className=" flex items-center justify-between gap-4 py-4 border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger />

        <DynamicBreadcrumb />
      </div>

      {(pathname === "/app/transactions" || pathname === "/app/dashboard") && (
        <InputSearch />
      )}

      {(pathname === "/app/transactions" || pathname === "/app/dashboard") && (
        <TransactionDialog />
      )}

      <div className="flex items-center gap-2">
        {pathname === "/app/categories" && <CategoriesDialog />}
        {pathname === "/app/wallet" && <WalletDialog />}

        <ButtonTheme />
        <Notifications />
      </div>
    </header>
  );
}
