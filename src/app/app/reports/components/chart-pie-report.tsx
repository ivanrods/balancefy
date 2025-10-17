"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartLegend } from "@/components/ui/chart";
import { Transaction } from "@/types/transaction";
import { usePeriod } from "@/context/period-context";
import { useTransactions } from "@/hooks/use-transactions";
import { Skeleton } from "@/components/ui/skeleton";

export const description = "A pie chart with a legend";

function groupTransactions(transactions: Transaction[]) {
  const grouped = transactions.reduce((acc, curr) => {
    const categoria = curr.category?.name || "Outros";
    const cor = curr.category?.color || "#cccccc"; // fallback cinza

    if (!acc[categoria]) {
      acc[categoria] = { valor: 0, cor };
    }

    acc[categoria].valor += curr.value;
    return acc;
  }, {} as Record<string, { valor: number; cor: string }>);

  return Object.entries(grouped).map(([categoria, { valor, cor }]) => ({
    categoria,
    valor,
    fill: cor, // passa direto para o gráfico
  }));
}

export function ChartPieReport() {
  const { mode } = usePeriod();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { transactions, isLoading } = useTransactions(
    mode === "month" ? { month, year } : undefined
  );

  const chartData = groupTransactions(transactions ?? []);

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl animate-pulse" />;
  }

  const dateToday = new Date().toLocaleString("pt-BR", { month: "long" });

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribuição de Gastos</CardTitle>
        <CardDescription>
          {" "}
          Baseado nas transações de {dateToday}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="valor" nameKey="categoria" />
            <ChartLegend className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
