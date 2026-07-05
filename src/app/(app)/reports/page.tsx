import { PeriodFilterHeader } from "@/components/period-filter-header";
import SummaryCardReport from "./components/summary-card-report";
import { TransactionsExport } from "./components/transactions-export";
import { TransactionsTable } from "@/components/transactions-table";
import { ChartArea } from "@/components/chart-area";
import { ChartLine } from "./components/chart-line";
import { getServerTranslations } from "@/lib/locale";

export async function generateMetadata() {
  const t = await getServerTranslations();
  return {
    title: t("meta.reports.title"),
    description: t("meta.reports.description"),
  };
}

export default async function ReportsPage() {
  const t = await getServerTranslations();

  return (
    <div className="w-full h-full flex flex-col gap-4 mb-4">
      <PeriodFilterHeader title={t("reports.title")} />
      <SummaryCardReport />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartArea />
        <ChartLine />
      </section>
      <section className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("reports.transactionHistory")}</h2>
        <TransactionsExport />
      </section>
      <section>
        <TransactionsTable />
      </section>
    </div>
  );
}
