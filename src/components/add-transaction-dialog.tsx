import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

import { SelectDemo } from "./select-dialog";
import { RadioGroupDemo } from "./radio-group-dialog";

import { DatePicker } from "./date-picker";

export function DialogDemo() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus /> <p className="hidden md:block ">Nova Transação</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Transação</DialogTitle>
            <DialogDescription>
              Preencha todo o formulário com informações da transação.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" name="name" defaultValue="" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="valor">Valor</Label>
              <Input id="valor" name="username" defaultValue="" type="number" />
            </div>
            <div className="flex gap-4">
              <SelectDemo />
              <DatePicker />
            </div>

            <RadioGroupDemo />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
