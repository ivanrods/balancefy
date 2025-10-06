"use client";
import { Skeleton } from "@/components/ui/skeleton";

import WalletCard from "./components/wallet-card";
import { useWalllets } from "@/hooks/use-wallets";
export default function WalletPage() {
  const { wallets, isLoading } = useWalllets();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-80 rounded-xl mb-4" />
        ))}
      </div>
    );
  }

  return (
    <section>
      <h1 className="text-2xl font-bold pb-4">Carteira</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
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
      </div>
    </section>
  );
}
