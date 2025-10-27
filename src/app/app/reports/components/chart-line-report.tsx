"use client";

import { Line, LineChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usePeriod } from "@/context/period-context";
import { useTransactionsType } from "@/hooks/use-transactions-type";

export const description = "A multiple line chart";

const chartConfig = {
  income: {
    label: "Entarada",
    color: "var(--chart-2)",
  },
  expense: {
    label: "Saída",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartLineReport() {
  const { mode } = usePeriod();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { transactionsType } = useTransactionsType(
    mode === "month" ? { month, year } : undefined
  );

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={transactionsType}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="income"
              type="monotone"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="expense"
              type="monotone"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
