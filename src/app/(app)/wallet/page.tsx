import { PeriodFilterHeader } from "@/components/period-filter-header";
import WalletGrid from "./components/wallet-grid";
import { getServerTranslations } from "@/lib/locale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getWalletsSummary } from "@/lib/services/wallet-service";

export async function generateMetadata() {
  const t = await getServerTranslations();
  return {
    title: t("meta.wallet.title"),
    description: t("meta.wallet.description"),
  };
}

export default async function WalletPage() {
  const t = await getServerTranslations();
  const session = await getServerSession(authOptions);

  let initialWallets = undefined;
  if (session?.user?.id) {
    initialWallets = await getWalletsSummary({ userId: session.user.id });
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 pb-4">
      <PeriodFilterHeader title={t("sidebar.wallet")} />
      <WalletGrid initialWallets={initialWallets} />
    </div>
  );
}
