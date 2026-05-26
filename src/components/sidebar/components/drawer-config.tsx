"use client";

import * as React from "react";
import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/context/currency-context";

export function DrawerConfig() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = React.useState(false);
  const [tempCurrency, setTempCurrency] =
    React.useState<"BRL" | "USD">(currency);

  React.useEffect(() => {
    if (open) {
      setTempCurrency(currency);
    }
  }, [open, currency]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Settings className="w-4 h-4 mr-2" />
          Configurações
        </DropdownMenuItem>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Configurações</DrawerTitle>
            <DrawerDescription>Ajuste suas configurações.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Moeda</label>
              <div className="flex gap-2">
                <Button
                  variant={tempCurrency === "BRL" ? "default" : "outline"}
                  onClick={() => setTempCurrency("BRL")}
                  className="flex-1"
                >
                  BRL (R$)
                </Button>
                <Button
                  variant={tempCurrency === "USD" ? "default" : "outline"}
                  onClick={() => setTempCurrency("USD")}
                  className="flex-1"
                >
                  USD ($)
                </Button>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={() => { setCurrency(tempCurrency); setOpen(false); }}>
              Salvar
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
