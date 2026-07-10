import { ChartArea } from "../../../components/chart-area";
import { ChartPieDonut } from "./components/chart-pie-donut";
import { TransactionsTable } from "@/components/transactions-table";
import Summary from "./components/summary";
import { PeriodFilterHeader } from "@/components/period-filter-header";
import { getServerTranslations } from "@/lib/locale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getTransactions } from "@/lib/services/transaction-service";

export async function generateMetadata() {
  const t = await getServerTranslations();
  return {
    title: t("meta.dashboard.title"),
    description: t("meta.dashboard.description"),
  };
}

const Dashboard = async () => {
  const t = await getServerTranslations();
  const session = await getServerSession(authOptions);

  let initialTransactions = undefined;
  if (session?.user?.id) {
    const now = new Date();
    initialTransactions = await getTransactions(session.user.id, {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PeriodFilterHeader title={t("sidebar.dashboard")} />
      <Summary initialTransactions={initialTransactions} />
      <section className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 xl:col-span-1 ">
          <ChartPieDonut initialTransactions={initialTransactions} />
        </div>
        <div className="lg:col-span-2 xl:col-span-3 ">
          <ChartArea initialTransactions={initialTransactions} />
        </div>
      </section>
      <section>
        <TransactionsTable initialTransactions={initialTransactions} />
      </section>
    </div>
  );
};

export default Dashboard;
