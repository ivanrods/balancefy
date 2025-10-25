import { PeriodFilterHeader } from "@/components/period-filter-header";
import SummaryCardReport from "./components/summary-card-report";
import { ChartAreaReport } from "./components/chart-area-report";
import { ChartPieReport } from "./components/chart-pie-report";
import { DataTableReport } from "./components/data-table-report";

export const metadata = {
  title: "Relatórios | Balancefy",
  description:
    "Visualize relatórios detalhados com gráficos de desempenho financeiro. Analise entradas, saídas e descubra como otimizar seu orçamento.",
};

export default function ReportsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4 mb-4">
      <PeriodFilterHeader title=" Relatórios Financeiros" />
      <SummaryCardReport />
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
