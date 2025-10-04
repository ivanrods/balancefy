"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

type DatePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
};

export function DateDialog({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3 ">
      <Label htmlFor="date" className="px-1">
        Data
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className=" justify-between font-normal"
          >
            {value
              ? new Date(value).toLocaleDateString("pt-BR")
              : "Selecionar data"}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
