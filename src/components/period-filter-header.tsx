"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePeriod } from "@/context/period-context";
import { useTranslation } from "@/hooks/use-translation";

interface PeriodFilterHeaderProps {
  title: string;
}

export function PeriodFilterHeader({ title }: PeriodFilterHeaderProps) {
  const { t, locale } = useTranslation();
  const { mode, setMode, selectedMonth, setSelectedMonth } = usePeriod();
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return date.toLocaleDateString(locale, { month: "long" });
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <Select value={mode} onValueChange={(val) => setMode(val as "month" | "total")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("period.selectPeriod")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">{t("period.byMonth")}</SelectItem>
            <SelectItem value="total">{t("period.totalPeriod")}</SelectItem>
          </SelectContent>
        </Select>

        {mode === "month" ? (
          <Select
            value={String(selectedMonth)}
            onValueChange={(value) => setSelectedMonth(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("period.selectMonth")} />
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
