"use client";

import { PeriodFilterHeader } from "@/components/period-filter-header";
import { CategoriesDataTable } from "./components/categories-table";

export default function CategoriesPage() {
  return (
    <div className="w-full flex flex-col gap-4 px-4">
      <PeriodFilterHeader title="Categorias" />

      <div className="w-full flex flex-col xl:flex-row-reverse gap-4 ">
        <CategoriesDataTable />
      </div>
    </div>
  );
}
