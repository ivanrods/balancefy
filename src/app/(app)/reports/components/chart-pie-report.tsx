"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSummaryAll } from "@/hooks/use-summary-all";
import { Skeleton } from "@/components/ui/skeleton";
import { usePeriod } from "@/context/period-context";
import { useSummaryMonth } from "@/hooks/use-summary-month";
import { useTranslation } from "@/hooks/use-translation";
import { Transaction } from "@/types/transaction";

type ChartPieReportProps = {
  initialTransactions?: Transaction[];
};

export function ChartPieReport({ initialTransactions }: ChartPieReportProps) {
  const { t } = useTranslation();
  const { mode } = usePeriod();

  const { incomeAll, expenseAll, isLoading } = useSummaryAll(initialTransactions);
  const { incomeMonth, expenseMonth } = useSummaryMonth(initialTransactions);

  const income = mode === "month" ? incomeMonth : incomeAll;
  const expense = mode === "month" ? expenseMonth : expenseAll;

  const chartConfig = {
    income: { label: t("reports.summaryIncome"), color: "var(--chart-2)" },
    expense: { label: t("reports.summaryExpenses"), color: "var(--primary)" },
  } satisfies ChartConfig;

  const incomeLabel = t("reports.summaryIncome");
  const expenseLabel = t("reports.summaryExpenses");

  const chartData = [
    mode === "month"
      ? { tipo: incomeLabel, valor: income, fill: "var(--color-income)" }
      : { tipo: incomeLabel, valor: incomeAll, fill: "var(--color-income)" },
    mode === "month"
      ? { tipo: expenseLabel, valor: expense, fill: "var(--color-expense)" }
      : { tipo: expenseLabel, valor: expenseAll, fill: "var(--color-expense)" },
  ];

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl animate-pulse" />;
  }

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[200px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="valor" nameKey="tipo" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
