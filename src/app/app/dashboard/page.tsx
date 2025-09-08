import { ChartAreaFinance } from "@/components/chart-area-interactive";
import { ChartPieDonut } from "@/components/chart-pie-donut";
import { DataTableDemo } from "@/components/data-table";
import Summary from "./components/summary";

const Dashboard = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <section className="flex flex-col lg:flex-row gap-4">
        <Summary />
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
