import { ChartAreaFinance } from "./components/chart-area-interactive";
import { ChartPieDonut } from "./components/chart-pie-donut";
import { TransactionsTable } from "@/app/app/dashboard/components/transactions-table";
import Summary from "./components/summary";
import { PeriodFilterHeader } from "@/components/period-filter-header";

export const metadata = {
  title: "Dashboard | Balancefy",
  description:
    "Acompanhe seu resumo financeiro com gráficos e estatísticas em tempo real. Veja suas entradas, saídas e saldo atual em um só lugar.",
};

const Dashboard = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PeriodFilterHeader title="Dashboard financeiro" />
      <Summary />
      <section className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 xl:col-span-1 ">
          <ChartPieDonut />
        </div>
        <div className="lg:col-span-2 xl:col-span-3 ">
          <ChartAreaFinance />
        </div>
      </section>
      <section>
        <TransactionsTable />
      </section>
    </div>
  );
};

export default Dashboard;
