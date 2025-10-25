import { PeriodFilterHeader } from "@/components/period-filter-header";
import { TransactionsTable } from "./components/transactions-table";

export const metadata = {
  title: "Transações | Balancefy",
  description:
    "Gerencie suas transações financeiras de forma simples. Registre novas entradas e saídas e mantenha o controle de seus gastos e ganhos.",
};

export default function TransactionsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PeriodFilterHeader title="Transações" />
      <TransactionsTable />
    </div>
  );
}
