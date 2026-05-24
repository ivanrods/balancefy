"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Transaction } from "@/types/transaction";
import { usePeriod } from "@/context/period-context";
import { useTransactions } from "@/hooks/use-transactions";
import { Skeleton } from "@/components/ui/skeleton";

export const description = "A pie chart with a legend";

function groupTransactions(transactions: Transaction[]) {
  const grouped = transactions.reduce(
    (acc, curr) => {
      const categoria = curr.category?.name || "Outros";
      const cor = curr.category?.color || "#cccccc"; // fallback cinza

      if (!acc[categoria]) {
        acc[categoria] = { valor: 0, cor };
      }

      acc[categoria].valor += curr.value;
      return acc;
    },
    {} as Record<string, { valor: number; cor: string }>,
  );

  return Object.entries(grouped).map(([categoria, { valor, cor }]) => ({
    categoria,
    valor,
    fill: cor, // passa direto para o gráfico
  }));
}

export function ChartPieReport() {
  const { mode, selectedMonth } = usePeriod();

  const now = new Date();
  const year = now.getFullYear();

  const { transactions, isLoading } = useTransactions(
    mode === "month" ? { month: selectedMonth, year } : undefined,
  );

  const chartData = groupTransactions(transactions ?? []);

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl animate-pulse" />;
  }

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="valor" nameKey="categoria" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
