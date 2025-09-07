import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { Transaction } from "@/types/transaction";

type Categoria = Transaction["categoria"];

type SelectDemoProps = {
  value: Categoria;
  onValueChange: (val: Categoria) => void;
};

export function SelectDialog({ value, onValueChange }: SelectDemoProps) {
  return (
    <div className="flex flex-col gap-3">
      <Select value={value} onValueChange={onValueChange}>
        <Label className="px-1">Categoria</Label>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione a categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categoria</SelectLabel>
            <SelectItem value="Alimentacao"> Alimentacao</SelectItem>
            <SelectItem value="Transporte"> Transporte</SelectItem>
            <SelectItem value="Moradia">Moradia</SelectItem>
            <SelectItem value="Lazer">Lazer</SelectItem>
            <SelectItem value="Outros">Outros</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
