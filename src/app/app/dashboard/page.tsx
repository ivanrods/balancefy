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
      <PeriodFilterHeader title="Finance Dashboard" />
      <Summary />
      <section className="flex flex-col lg:flex-row gap-4">
        <ChartPieDonut />
        <ChartAreaFinance />
      </section>
      <section>
        <TransactionsTable />
      </section>
    </div>
  );
};

export default Dashboard;
