"use client";
import { Skeleton } from "@/components/ui/skeleton";

import WalletCard from "../components/wallet-card";
import { useWalllets } from "@/hooks/use-wallets";

import { usePeriod } from "@/context/period-context";
export default function WalletGrid() {
  const { mode } = usePeriod();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { wallets, isLoading } = useWalllets(
    mode === "month" ? { month, year } : undefined
  );

  if (isLoading) {
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
      {(wallets ?? []).length === 0 && (
        <p className="text-center col-span-full text-muted-foreground">
          Nenhuma carteira encontrada.
        </p>
      )}
    </div>
  );
}
