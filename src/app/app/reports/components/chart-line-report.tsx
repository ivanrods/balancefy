"use client";

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usePeriod } from "@/context/period-context";
import { useTransactionsType } from "@/hooks/use-transactions-type";

const chartConfig = {
  income: { label: "Entrada", color: "var(--chart-2)" },
  expense: { label: "Saída", color: "var(--primary)" },
} satisfies ChartConfig;

export function ChartLineReport() {
  const { mode } = usePeriod();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { transactionsType } = useTransactionsType({
    month,
    year,
    period: mode === "month" ? "week" : "month",
  });

  return (
    <Card>
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
    </Card>
  );
}
