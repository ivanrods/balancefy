"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ChartLineReport } from "./chart-line-report";
import { usePeriod } from "@/context/period-context";
import { useSummaryReportAll } from "@/hooks/use-summary-report-all";
import { useSummaryReportMonth } from "@/hooks/use-summary-report-all-month";
import { Skeleton } from "@/components/ui/skeleton";

export default function SummaryCardReport() {
  const { mode } = usePeriod();

  const { incomeAll, expenseAll, isLoading } = useSummaryReportAll();

  const { incomeMonth, expenseMonth, dateToday } = useSummaryReportMonth();

  // Escolhe qual conjunto de dados exibir com base no modo
  const income = mode === "month" ? incomeMonth : incomeAll;
  const expense = mode === "month" ? expenseMonth : expenseAll;
  const month = mode === "month" ? dateToday : "Todo o período";

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-xl animate-pulse" />;
  }

  return (
    <Card className="w-full h-full flex flex-row justify-between">
      <div className="flex flex-col lg:flex-row w-full justify-between gap-4">
        <div className="h-full flex flex-col flex-1 justify-between ">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Distribuição de Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm ">
              <p>
                Evolução do saldo ao longo de{" "}
                <span className="font-semibold text-primary">{month}</span>,
                destacando variações entre entradas e saídas.
              </p>

              <p>
                Distribuição dos{" "}
                <span className="font-semibold text-primary">
                  gastos por categoria
                </span>{" "}
                referente ao período de {month}, permitindo identificar onde
                está concentrada a maior parte das despesas.
              </p>

              <p>
                Comparativo dos{" "}
                <span className="font-semibold text-primary">
                  valores de entradas e saídas
                </span>{" "}
                durante {month}, facilitando a visualização do saldo líquido no
                período.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex pt-4  text-sm gap-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-chart-2 rounded-lg">
                <ArrowUp className="text-white" />
              </div>

              <div>
                <p className="font-medium text-lg">{formatCurrency(income)} </p>
                <span className="text-sm text-gray-400">Entradas</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <ArrowDown className="text-white" />
              </div>

              <div>
                <p className=" font-medium text-lg">
                  {formatCurrency(expense)}
                </p>
                <span className="text-sm text-gray-400">Saídas</span>
              </div>
            </div>
          </CardFooter>
        </div>
        <div className="w-full h-full px-4 lg:max-w-md">
          <ChartLineReport />
        </div>
      </div>
    </Card>
  );
}
