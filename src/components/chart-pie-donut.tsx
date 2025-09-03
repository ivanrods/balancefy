"use client";

import { TrendingDown } from "lucide-react";
import { Pie, PieChart } from "recharts";

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

export const description = "Distribuição de gastos por categoria";

const chartData = [
  { categoria: "Alimentação", valor: 1200, fill: "hsl(0, 84%, 60%)" }, // vermelho médio
  { categoria: "Transporte", valor: 600, fill: "hsl(0, 72%, 55%)" }, // vermelho intenso
  { categoria: "Lazer", valor: 450, fill: "hsl(0, 68%, 50%)" }, // vermelho escuro
  { categoria: "Moradia", valor: 1800, fill: "hsl(0, 78%, 65%)" }, // vermelho claro
  { categoria: "Outros", valor: 300, fill: "hsl(0, 90%, 70%)" }, // vermelho mais suave
];

const chartConfig = {
  valor: {
    label: "Valor",
  },
  food: {
    label: "Alimentação",
    color: "var(--chart-1)",
  },
  transport: {
    label: "Transporte",
    color: "var(--chart-2)",
  },
  entertainment: {
    label: "Lazer",
    color: "var(--chart-3)",
  },
  housing: {
    label: "Moradia",
    color: "var(--chart-4)",
  },
  other: {
    label: "Outros",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function ChartPieDonut() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribuição de Gastos</CardTitle>
        <CardDescription>Agosto 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="valor"
              nameKey="categoria"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Gastos aumentaram 3.4% este mês <TrendingDown className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Baseado nas transações do mês atual
        </div>
      </CardFooter>
    </Card>
  );
}
