"use client";

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usePeriod } from "@/context/period-context";
import { useTransactionsType } from "@/hooks/use-transactions-type";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";

export function ChartLine() {
  const { t, locale } = useTranslation();

  const chartConfig = {
    income: { label: t("reports.summaryIncome"), color: "var(--chart-2)" },
    expense: { label: t("reports.summaryExpenses"), color: "var(--primary)" },
  } satisfies ChartConfig;

  const { mode, selectedMonth } = usePeriod();
  const now = new Date();
  const year = now.getFullYear();

  const isMonthMode = mode === "month";

  const { transactionsType, isLoading } = useTransactionsType({
    period: isMonthMode ? "week" : "month",
    month: isMonthMode ? selectedMonth : undefined,
    year,
  });

  const mothLabel = new Date(year, selectedMonth - 1).toLocaleString(locale, {
    month: "long",
    year: "numeric",
  });

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl animate-pulse" />;
  }

  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("reports.charts.spendingDistribution")}</CardTitle>
        <CardDescription>
          {t("reports.charts.balanceEvolution")}{" "}
          <span className="font-semibold text-primary">
            {isMonthMode
              ? new Date(year, selectedMonth - 1).toLocaleString(locale, {
                  month: "long",
                  year: "numeric",
                })
              : t("reports.charts.wholePeriod")}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={transactionsType}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey={mode === "month" ? "week" : "month"}
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "0.8rem" }}
            />
            <YAxis hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="income"
              type="monotone"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={600}
            />
            <Line
              dataKey="expense"
              type="monotone"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={600}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {isMonthMode ? (
            <p>Baseado nas transações do mês de {mothLabel} </p>
          ) : (
            <p>Baseado nas transações de todo o período </p>
          )}
          <TrendingUp className="h-4 w-4 " />
        </div>
        <div className="text-muted-foreground leading-none">
          Passe o mouse sobre o gráfico para ver detalhes
        </div>
      </CardFooter>
    </Card>
  );
}
