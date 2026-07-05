import { PeriodFilterHeader } from "@/components/period-filter-header";
import WalletGrid from "./components/wallet-grid";
import { getServerTranslations } from "@/lib/locale";

export async function generateMetadata() {
  const t = await getServerTranslations();
  return {
    title: t("meta.wallet.title"),
    description: t("meta.wallet.description"),
  };
}

export default async function WalletPage() {
  const t = await getServerTranslations();
  return (
    <div className="w-full h-full flex flex-col gap-4 pb-4">
      <PeriodFilterHeader title={t("sidebar.wallet")} />
      <WalletGrid />
    </div>
  );
}
