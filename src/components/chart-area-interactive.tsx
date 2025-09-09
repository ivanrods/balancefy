"use client";

import { Transaction } from "@/types/transaction";
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
import { useTransactions } from "@/hooks/use-transactions";

const months = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

// 🔧 Agrupa transações por mês e calcula saldo
function groupTransactionsByMonth(transactions: Transaction[]) {
  const grouped = transactions.reduce((acc, curr) => {
    const date = new Date(curr.data);
    const monthIndex = date.getMonth();
    const month = months[monthIndex];

    const valor = curr.tipo === "entrada" ? curr.valor : -curr.valor;

    acc[month] = (acc[month] || 0) + valor;
    return acc;
  }, {} as Record<string, number>);

  return months.map((m) => ({
    month: m,
    saldo: grouped[m] || 0,
  }));
}

const chartConfig = {
  saldo: {
    label: "Saldo",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaFinance() {
  const { transactions } = useTransactions();

  const chartData = groupTransactionsByMonth(transactions || []);

  return (
    <Card className="flex flex-col flex-1">
      <CardHeader className="items-center pb-0">
        <CardTitle>Evolução do Saldo</CardTitle>
        <CardDescription>{new Date().getFullYear()}</CardDescription>
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
              stroke="var(--primary)"
              fill="var(--primary)"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Saldo subiu 12% nos últimos meses
          <TrendingUp className="h-4 w-4 " />
        </div>
        <div className="text-muted-foreground leading-none">
          Baseado no total de entradas e saídas
        </div>
      </CardFooter>
    </Card>
  );
}
