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

export function SelectDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Select>
        <Label className="px-1">Categoria</Label>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione a categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categoria</SelectLabel>
            <SelectItem value="alimentacao"> Alimentacao</SelectItem>
            <SelectItem value="transporte"> Transporte</SelectItem>
            <SelectItem value="moradia">Moradia</SelectItem>
            <SelectItem value="lazer">Lazer</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
