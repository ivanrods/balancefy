"use client";

import { useTransactions } from "@/hooks/use-transactions";
import { ChartPie } from "lucide-react";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Transaction } from "@/types/transaction";
import { Skeleton } from "./ui/skeleton";

export const description = "Distribuição de gastos por categoria";

// Função para agrupar transações por categoria
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
type ChartProps = {
  mode: "month" | "all";
};

export function ChartPieDonut({ mode }: ChartProps) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { transactions, isLoading } = useTransactions(
    mode === "month" ? { month, year } : undefined
  );

  const chartData = groupTransactions(transactions ?? []);

  if (isLoading) {
    return <Skeleton className="h-96 w-full md:w-96 rounded-xl" />;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribuição de Gastos</CardTitle>
        <CardDescription>Mes</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          // você pode passar config vazio, já que as cores vêm do banco
          config={{}}
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
          Baseado nas transações de todo o periodo{" "}
          <ChartPie className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Passe o mouse sobre o gráfico para ver detalhes
        </div>
      </CardFooter>
    </Card>
  );
}
