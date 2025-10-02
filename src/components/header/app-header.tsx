"use client";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { ButtonTheme } from "./button-theme";
import { TransactionDialog } from "../dialogs/create-transaction-dialog";
import DynamicBreadcrumb from "./dynamic-breadcrumb";
import { InputSearch } from "./input-search";
import { Notifications } from "./notifications";
import { CategoriesDialog } from "../dialogs/create-categories-dialog";
import { WalletDialog } from "../dialogs/create-wallet-dialog";

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
