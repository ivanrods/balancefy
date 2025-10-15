import { PeriodFilterHeader } from "@/components/period-filter-header";
import { TransactionsTable } from "./components/transactions-table";

export default function TransactionsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PeriodFilterHeader title="Transações" />

      <TransactionsTable />
    </div>
  );
}
