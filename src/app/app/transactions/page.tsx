import { DataTableDemo } from "@/components/data-table";
import { PeriodFilterHeader } from "@/components/period-filter-header";

export default function TransactionsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PeriodFilterHeader title="Transações" />

      <DataTableDemo />
    </div>
  );
}
