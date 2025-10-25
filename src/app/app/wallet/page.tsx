import { PeriodFilterHeader } from "@/components/period-filter-header";

import WalletGrid from "./components/wallet-grid";

export default function WalletPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4 pb-4">
      <PeriodFilterHeader title="Carteiras" />
      <WalletGrid />
    </div>
  );
}
