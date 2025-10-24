"use client";

import * as React from "react";
import { AlertCircleIcon, Settings } from "lucide-react";

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
import { Alert, AlertTitle } from "@/components/ui/alert";

export function DrawerConfig() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Settings className="w-4 h-4 mr-2" />
          Configurações
        </DropdownMenuItem>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Configuraçoes</DrawerTitle>
            <DrawerDescription>Ajuste suas configurações.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Funcionalidade em desenvolvimento</AlertTitle>
            </Alert>
          </div>
          <DrawerFooter>
            <Button>Salvar</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
