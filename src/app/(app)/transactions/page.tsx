import { PeriodFilterHeader } from "@/components/period-filter-header";
import { TransactionsTable } from "@/components/transactions-table";
import { getServerTranslations } from "@/lib/locale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getTransactions } from "@/lib/services/transaction-service";

export async function generateMetadata() {
  const t = await getServerTranslations();
  return {
    title: t("meta.transactions.title"),
    description: t("meta.transactions.description"),
  };
}

export default async function TransactionsPage() {
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
      <PeriodFilterHeader title={t("sidebar.transactions")} />
      <TransactionsTable initialTransactions={initialTransactions} />
    </div>
  );
}
