import { PeriodFilterHeader } from "@/components/period-filter-header";
import { CategoriesDataTable } from "./components/categories-table";

export const metadata = {
  title: "Categorias | Balancefy",
  description:
    "Organize suas transações por categoria e tenha uma visão clara de onde seu dinheiro está sendo gasto ou ganho.",
};

export default function CategoriesPage() {
  return (
    <div className="w-full flex flex-col gap-4 ">
      <PeriodFilterHeader title="Categorias" />

      <div className="w-full flex flex-col xl:flex-row-reverse gap-4 ">
        <CategoriesDataTable />
      </div>
    </div>
  );
}
