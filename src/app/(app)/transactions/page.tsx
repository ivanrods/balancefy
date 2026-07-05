import { PeriodFilterHeader } from "@/components/period-filter-header";
import { TransactionsTable } from "@/components/transactions-table";
import { getServerTranslations } from "@/lib/locale";

export async function generateMetadata() {
  const t = await getServerTranslations();
  return {
    title: t("meta.transactions.title"),
    description: t("meta.transactions.description"),
  };
}

export default async function TransactionsPage() {
  const t = await getServerTranslations();
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PeriodFilterHeader title={t("sidebar.transactions")} />
      <TransactionsTable />
    </div>
  );
}
