import { AppHeader } from "@/components/app-header";
import { DataTableDemo } from "@/components/data-table";

export default function TransactionsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <AppHeader />
      <h1 className="text-2xl font-bold">Transações</h1>
      <DataTableDemo />
    </div>
  );
}
