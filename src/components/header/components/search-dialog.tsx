"use client";

import * as React from "react";
import { ChartBarStacked, ClipboardMinus, Info, Settings, User, Wallet } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import Link from "next/link";
type SearchDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SearchDialog({ open, setOpen }: SearchDialogProps) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="text-muted-foreground text-sm">
        <span className="hidden md:inline-block">click</span>{" "}
        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">↵</span>
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("header.commandPlaceholder")} />
        <CommandList>
          <CommandEmpty>{t("header.noResults")}</CommandEmpty>
          <CommandGroup heading={t("header.suggestions")}>
            <CommandItem>
              <Wallet />
              <Link href="wallet">{t("sidebar.wallet")}</Link>
            </CommandItem>
            <CommandItem>
              <ChartBarStacked />
              <Link href="categories">{t("sidebar.categories")}</Link>
            </CommandItem>
            <CommandItem>
              <ClipboardMinus />
              <Link href="reports">{t("sidebar.reports")}</Link>
            </CommandItem>
            <CommandItem>
              <Info />
              <Link href="help">{t("sidebar.help")}</Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t("header.settings")}>
            <CommandItem>
              <User />
              <span>{t("header.profile")}</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>{t("header.settings")}</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
