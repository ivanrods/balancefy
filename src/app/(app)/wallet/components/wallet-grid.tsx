"use client";
import { Skeleton } from "@/components/ui/skeleton";

import WalletCard from "../components/wallet-card";
import { useWalletsQuery } from "@/hooks/use-wallets";
import { useTranslation } from "@/hooks/use-translation";
import type { Wallets } from "@/types/wallet";

import { usePeriod } from "@/context/period-context";

type WalletGridProps = {
  initialWallets?: Wallets[];
};

export default function WalletGrid({ initialWallets }: WalletGridProps) {
  const { t } = useTranslation();
  const { mode, selectedMonth } = usePeriod();
  const year = new Date().getFullYear();

  const { data: wallets, isLoading } = useWalletsQuery(
    mode === "month" ? { month: selectedMonth, year } : undefined,
    initialWallets,
  );

  if (isLoading && !wallets) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-80 rounded-xl mb-4" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {(wallets ?? []).map((wallet) => (
        <WalletCard
          id={wallet.id}
          key={wallet.id}
          name={wallet.name}
          balance={wallet.balance}
          lastTransaction={wallet.lastTransaction}
          totalExpense={wallet.totalExpense}
          totalIncome={wallet.totalIncome}
        />
      ))}
      {(wallets?.length ?? 0) === 0 && (
        <p className="text-center col-span-full text-muted-foreground">
          {t("wallet.noWallet")}
        </p>
      )}
    </div>
  );
}
