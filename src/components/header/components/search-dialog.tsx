"use client";

import * as React from "react";
import {
  ChartBarStacked,
  ClipboardMinus,
  Info,
  Settings,
  User,
  Wallet,
} from "lucide-react";

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
  return (
    <div>
      <p className="text-muted-foreground text-sm">
        <span className="hidden md:inline-block">click</span>{" "}
        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">↵</span>
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite um comando ou pesquise..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Sugestões">
            <CommandItem>
              <Wallet />
              <Link href="wallet">Carteira</Link>
            </CommandItem>
            <CommandItem>
              <ChartBarStacked />
              <Link href="categories">Categorias</Link>
            </CommandItem>
            <CommandItem>
              <ClipboardMinus />
              <Link href="reports">Relatórios</Link>
            </CommandItem>
            <CommandItem>
              <Info />
              <Link href="help">Ajuda</Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Configurações">
            <CommandItem>
              <User />
              <span>Perfil</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>Configurações</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
