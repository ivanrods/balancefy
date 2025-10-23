"use client";
import { ChartAreaFinance } from "./components/chart-area-interactive";
import { ChartPieDonut } from "./components/chart-pie-donut";
import { TransactionsTable } from "@/app/app/dashboard/components/transactions-table";
import Summary from "./components/summary";

import { PeriodFilterHeader } from "@/components/period-filter-header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Carregando...</p>;
  }
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PeriodFilterHeader title="Finance Dashboard" />

      <Summary />
      <section className="flex flex-col lg:flex-row gap-4">
        <ChartPieDonut />
        <ChartAreaFinance />
      </section>
      <section>
        <TransactionsTable />
      </section>
    </div>
  );
};

export default Dashboard;
