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
  const { mode, setMode, selectedMonth, setSelectedMonth } = usePeriod();
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <Select
          value={mode}
          onValueChange={(val) => setMode(val as "month" | "total")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Por mês</SelectItem>
            <SelectItem value="total">Período total</SelectItem>
          </SelectContent>
        </Select>

        {mode === "month" ? (
          <Select
            value={String(selectedMonth)}
            onValueChange={(value) => setSelectedMonth(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecionar mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((monthName, index) => (
                <SelectItem key={monthName} value={String(index + 1)}>
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>
    </div>
  );
}
