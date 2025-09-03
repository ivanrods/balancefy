"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

// 📊 Dados de exemplo: evolução do saldo mensal
const chartData = [
  { month: "Jan", saldo: 1200 },
  { month: "Fev", saldo: 1500 },
  { month: "Mar", saldo: 800 },
  { month: "Abr", saldo: 1800 },
  { month: "Mai", saldo: 2200 },
  { month: "Jun", saldo: 1700 },
];

const chartConfig = {
  saldo: {
    label: "Saldo",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaFinance() {
  return (
    <Card className="flex flex-col flex-1">
      <CardHeader className="items-center pb-0">
        <CardTitle>Evolução do Saldo</CardTitle>
        <CardDescription>Janeiro - Junho 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <AreaChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(value as number)
                  }
                />
              }
            />
            <Area
              dataKey="saldo"
              type="monotone"
              stroke="var(--color-saldo)"
              fill="var(--color-saldo)"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Saldo subiu 12% nos últimos 6 meses
          <TrendingUp className="h-4 w-4 " />
        </div>
        <div className="text-muted-foreground leading-none">
          Baseado no total de entradas e saídas
        </div>
      </CardFooter>
    </Card>
  );
}
