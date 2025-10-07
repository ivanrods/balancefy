"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePeriod } from "@/context/period-context";

interface PeriodFilterHeaderProps {
  title: string;
}

export function PeriodFilterHeader({ title }: PeriodFilterHeaderProps) {
  const { mode, setMode } = usePeriod();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Select
        value={mode}
        onValueChange={(val) => setMode(val as "month" | "total")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecionar período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="month">Mês atual</SelectItem>
          <SelectItem value="total">Período total</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
