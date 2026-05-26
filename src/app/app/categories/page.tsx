import { PeriodFilterHeader } from "@/components/period-filter-header";
import { CategoriesDataTable } from "./components/categories-table";
import { getServerTranslations } from "@/lib/locale";

export async function generateMetadata() {
  const t = await getServerTranslations();
  return {
    title: t("meta.categories.title"),
    description: t("meta.categories.description"),
  };
}

export default async function CategoriesPage() {
  const t = await getServerTranslations();
  return (
    <div className="w-full flex flex-col gap-4 ">
      <PeriodFilterHeader title={t("sidebar.categories")} />

      <div className="w-full flex flex-col xl:flex-row-reverse gap-4 ">
        <CategoriesDataTable />
      </div>
    </div>
  );
}
