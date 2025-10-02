"use client";
import { Skeleton } from "@/components/ui/skeleton";

import { useTransactions } from "@/hooks/use-transactions";
import WalletCard from "./components/wallet-card";
export default function WalletPage() {
  const { isLoading } = useTransactions();

  if (isLoading) {
    return <Skeleton className="w-full h-80 rounded-xl" />;
  }

  return (
    <section>
      <h1 className="text-2xl font-bold pb-4">Carteira</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <WalletCard />
      </div>
    </section>
  );
}
