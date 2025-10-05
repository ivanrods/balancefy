"use client";
import { ChartPieDonut } from "@/components/chart-pie-donut";
import CategoriesTable from "./components/categories-table";

export default function CategoriesPage() {
  return (
    <div className="w-full flex flex-col gap-4 px-4">
      <h1 className="text-2xl font-bold">Categorias</h1>
      <div className="w-full flex flex-col xl:flex-row-reverse gap-4 ">
        <CategoriesTable />
      </div>
    </div>
  );
}
