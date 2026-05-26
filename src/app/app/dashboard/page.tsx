import { ChartArea } from "../../../components/chart-area";
import { ChartPieDonut } from "./components/chart-pie-donut";
import { TransactionsTable } from "@/components/transactions-table";
import Summary from "./components/summary";
import { PeriodFilterHeader } from "@/components/period-filter-header";
import { getServerTranslations } from "@/lib/locale";

export async function generateMetadata() {
  const t = await getServerTranslations();
  return {
    title: t("meta.dashboard.title"),
    description: t("meta.dashboard.description"),
  };
}

const Dashboard = async () => {
  const t = await getServerTranslations();
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PeriodFilterHeader title={t("sidebar.dashboard")} />
      <Summary />
      <section className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 xl:col-span-1 ">
          <ChartPieDonut />
        </div>
        <div className="lg:col-span-2 xl:col-span-3 ">
          <ChartArea />
        </div>
      </section>
      <section>
        <TransactionsTable />
      </section>
    </div>
  );
};

export default Dashboard;
