import { ChartAreaFinance } from "@/components/chart-area-interactive";
import { ChartPieDonut } from "@/components/chart-pie-donut";
import { PeriodFilterHeader } from "@/components/period-filter-header";

export default function ReportsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PeriodFilterHeader title="Relatórios" />
      <section className="flex flex-col lg:flex-row gap-4">
        <ChartPieDonut />
        <ChartAreaFinance />
      </section>
    </div>
  );
}
