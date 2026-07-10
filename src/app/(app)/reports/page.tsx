import { PeriodFilterHeader } from "@/components/period-filter-header";
import SummaryCardReport from "./components/summary-card-report";
import { TransactionsExport } from "./components/transactions-export";
import { TransactionsTable } from "@/components/transactions-table";
import { ChartArea } from "@/components/chart-area";
import { ChartLine } from "./components/chart-line";
import { getServerTranslations } from "@/lib/locale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getTransactions, getTransactionChart } from "@/lib/services/transaction-service";

export async function generateMetadata() {
  const t = await getServerTranslations();
  return {
    title: t("meta.reports.title"),
    description: t("meta.reports.description"),
  };
}

export default async function ReportsPage() {
  const t = await getServerTranslations();
  const session = await getServerSession(authOptions);

  let initialTransactions = undefined;
  let initialChartData = undefined;
  if (session?.user?.id) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    initialTransactions = await getTransactions(session.user.id, { month, year });
    initialChartData = await getTransactionChart(session.user.id, "week", month, year);
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 mb-4">
      <PeriodFilterHeader title={t("reports.title")} />
      <SummaryCardReport initialTransactions={initialTransactions} />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartArea initialTransactions={initialTransactions} />
        <ChartLine initialChartData={initialChartData} />
      </section>
      <section className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("reports.transactionHistory")}</h2>
        <TransactionsExport initialTransactions={initialTransactions} />
      </section>
      <section>
        <TransactionsTable initialTransactions={initialTransactions} />
      </section>
    </div>
  );
}
