"use client";
import { ChartAreaFinance } from "@/components/chart-area-interactive";
import { ChartPieDonut } from "@/components/chart-pie-donut";
import { DataTableDemo } from "@/components/data-table";
import Summary from "./components/summary";

import { PeriodFilterHeader } from "@/components/period-filter-header";

const Dashboard = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PeriodFilterHeader title="Finance Dashboard" />

      <Summary />
      <section className="flex flex-col lg:flex-row gap-4">
        <ChartPieDonut />
        <ChartAreaFinance />
      </section>
      <section>
        <DataTableDemo />
      </section>
    </div>
  );
};

export default Dashboard;
