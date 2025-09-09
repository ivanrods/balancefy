"use client";

import { useTransactions } from "@/hooks/use-transactions";
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
import { Transaction } from "@/types/transaction";

export const description = "Distribuição de gastos por categoria";

// Configuração das categorias e cores
const chartConfig = {
  valor: { label: "Valor" },
  Alimentação: { label: "Alimentação", color: "hsl(0, 85%, 70%)" }, // vermelho bem claro
  Transporte: { label: "Transporte", color: "hsl(0, 80%, 60%)" }, // vermelho médio claro
  Lazer: { label: "Lazer", color: "hsl(0, 75%, 50%)" }, // vermelho médio
  Moradia: { label: "Moradia", color: "hsl(0, 70%, 40%)" }, // vermelho mais escuro
  Outros: { label: "Outros", color: "hsl(0, 65%, 30%)" }, // vermelho bem escuro
} satisfies ChartConfig;

// Função para agrupar transações por categoria
function groupTransactions(transactions: Transaction[]) {
  const grouped = transactions.reduce((acc, curr) => {
    const categoria = curr.categoria || "Outros";
    acc[categoria] = (acc[categoria] || 0) + curr.valor;
    return acc;
  }, {} as Record<Transaction["categoria"], number>);

  return Object.entries(grouped).map(([categoria, valor]) => {
    // Se a categoria não existir no chartConfig, cai para "Outros"
    const config =
      chartConfig[categoria as Transaction["categoria"]] ??
      chartConfig["Outros"];

    return {
      categoria,
      valor,
      fill: config.color,
    };
  });
}

export function ChartPieDonut() {
  const { transactions } = useTransactions();

  // Agrupa as transações antes de enviar para o gráfico
  const chartData = groupTransactions(transactions ?? []);

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
