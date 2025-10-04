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
import { Label } from "../../../../components/ui/label";

type Category = {
  id: string;
  name: string;
};

type SelectCategoryProps = {
  value: string;
  onValueChange: (val: string) => void;
  categories: Category[];
};

export function SelectCategory({
  value,
  onValueChange,
  categories,
}: SelectCategoryProps) {
  return (
    <div className="flex flex-col gap-3">
      <Select value={value} onValueChange={onValueChange}>
        <Label className="px-1">Categoria</Label>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione a categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
