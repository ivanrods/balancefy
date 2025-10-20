"use client";
import { PeriodFilterHeader } from "@/components/period-filter-header";
import SummaryCardReport from "./components/summary-card-report";
import { useSummaryReportAll } from "@/hooks/use-summary-report-all";
import { useSummaryReportMonth } from "@/hooks/use-summary-report-all-month";
import { usePeriod } from "@/context/period-context";
import { ChartAreaReport } from "./components/chart-area-report";
import { ChartPieReport } from "./components/chart-pie-report";
import { DataTableReport } from "./components/data-table-report";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  const { mode } = usePeriod();

  const { incomeAll, expenseAll, isLoading } = useSummaryReportAll();

  const { incomeMonth, expenseMonth, dateToday } = useSummaryReportMonth();

  // Escolhe qual conjunto de dados exibir com base no modo
  const income = mode === "month" ? incomeMonth : incomeAll;
  const expense = mode === "month" ? expenseMonth : expenseAll;
  const month = mode === "month" ? dateToday : "Todo o período";

  return (
    <div className="w-full h-full flex flex-col gap-4 mb-4">
      <PeriodFilterHeader title=" Relatórios Financeiros" />

      {/* Cards Comparativos */}
      <section className="">
        {isLoading && (
          <Skeleton className="h-64 w-full rounded-xl animate-pulse" />
        )}
        {!isLoading && (
          <SummaryCardReport
            title="Distribuição de Gastos"
            value={month}
            income={income}
            expense={expense}
          />
        )}
      </section>

      {/* Gráficos Analíticos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartAreaReport />
        <ChartPieReport />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Histórico de Transações</h2>
        <DataTableReport />
      </section>
    </div>
  );
}
