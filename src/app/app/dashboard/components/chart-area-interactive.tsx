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

import { usePeriod } from "@/context/period-context";
import { Skeleton } from "@/components/ui/skeleton";

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

// Agrupa transações por mês e calcula saldo
function groupTransactionsByMonth(transactions: Transaction[]) {
  const grouped = transactions.reduce((acc, curr) => {
    const date = new Date(curr.date);
    const monthIndex = date.getMonth();
    const month = months[monthIndex];

    const valor = curr.type === "income" ? curr.value : -curr.value;

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
  const { mode } = usePeriod();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { transactions, isLoading } = useTransactions(
    mode === "month" ? { month, year } : undefined
  );

  const chartData = groupTransactionsByMonth(transactions || []);

  const dateToday = new Date().toLocaleString("pt-BR", { month: "long" });

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl animate-pulse" />;
  }

  return (
    <Card className="h-full w-full">
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
          {mode === "month" ? (
            <p>Baseado nas transações do mês de {dateToday} </p>
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
