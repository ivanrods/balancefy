import { PeriodFilterHeader } from "@/components/period-filter-header";
import { CategoriesDataTable } from "./components/categories-table";
import { getServerTranslations } from "@/lib/locale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getCategoriesSummary } from "@/lib/services/category-service";

export async function generateMetadata() {
  const t = await getServerTranslations();
  return {
    title: t("meta.categories.title"),
    description: t("meta.categories.description"),
  };
}

export default async function CategoriesPage() {
  const t = await getServerTranslations();
  const session = await getServerSession(authOptions);

  let initialCategories = undefined;
  if (session?.user?.id) {
    initialCategories = await getCategoriesSummary({ userId: session.user.id });
  }

  return (
    <div className="w-full flex flex-col gap-4 ">
      <PeriodFilterHeader title={t("sidebar.categories")} />

      <div className="w-full flex flex-col xl:flex-row-reverse gap-4 ">
        <CategoriesDataTable initialCategories={initialCategories} />
      </div>
    </div>
  );
}
