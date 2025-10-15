"use client";
import { PeriodFilterHeader } from "@/components/period-filter-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryCardReport from "./components/summary-card-report";
import { useSummaryReportAll } from "@/hooks/use-summary-report-all";
import { formatCurrency } from "@/utils/format-currency";
import { useSummaryReportMonth } from "@/hooks/use-summary-report-all-month";
import { usePeriod } from "@/context/period-context";
import { ChartAreaReport } from "./components/chart-area-report";
import { ChartPieReport } from "./components/chart-pie-report";

export default function ReportsPage() {
  const { mode } = usePeriod();

  const { incomeAll, expenseAll, balanceAll } = useSummaryReportAll();

  const { incomeMonth, expenseMonth, dateToday } = useSummaryReportMonth();

  // Escolhe qual conjunto de dados exibir com base no modo
  const income = mode === "month" ? incomeMonth : incomeAll;
  const expense = mode === "month" ? expenseMonth : expenseAll;
  const balance = mode === "month" ? balanceAll : balanceAll;
  const month = mode === "month" ? dateToday : "Todo o período";

  return (
    <div className="w-full h-full flex flex-col gap-4 mb-4">
      <PeriodFilterHeader title=" Relatórios Financeiros" />

      {/* Cards Comparativos */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCardReport title="Período" value={month} />
        <SummaryCardReport
          title="Entradas"
          value={formatCurrency(income)}
          positive
        />
        <SummaryCardReport title="Saídas" value={formatCurrency(expense)} />
        <SummaryCardReport
          title="Saldo Médio"
          value={formatCurrency(balance)}
        />
      </section>

      {/* Gráficos Analíticos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartAreaReport />

        <ChartPieReport />
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Comparativo por Período</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            [ Gráfico de Barras aqui ]
          </CardContent>
        </Card>
      </section>

      {/* Insights */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Insights</h2>
        <ul className="space-y-2 text-sm">
          <li> Você economizou 20% a mais este mês comparado ao anterior.</li>
          <li> Gastos com Transporte aumentaram 45% em relação à média.</li>
          <li> Sua categoria mais constante é “Moradia”.</li>
        </ul>
      </section>

      {/* Tabela */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Histórico de Transações</h2>
        <Card>
          <CardContent className="py-6 flex items-center justify-center text-muted-foreground">
            [ Tabela detalhada de transações aqui ]
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
