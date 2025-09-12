import { ChartAreaFinance } from "@/components/chart-area-interactive";
import { ChartPieDonut } from "@/components/chart-pie-donut";

export default function ReportsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Relatórios</h1>
      <section className="flex flex-col lg:flex-row gap-4">
        <ChartPieDonut />
        <ChartAreaFinance />
      </section>
    </div>
  );
}
