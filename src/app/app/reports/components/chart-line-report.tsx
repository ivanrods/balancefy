"use client";

import { Line, LineChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";

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
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/transactions/transaction-type")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={data}>
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
