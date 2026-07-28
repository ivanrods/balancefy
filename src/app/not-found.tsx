import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getServerTranslations } from "@/lib/locale";

export default async function NotFound() {
  const t = await getServerTranslations();
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6 mx-2">
      <span className=" text-xl font-bold animate-bounce">404</span>
      <h1 className="text-3xl md:text-5xl text-primary font-bold text-center">
        {t("notFound.title")}
      </h1>
      <p className="text-sm md:text-md text-center">{t("notFound.description")}</p>

      <Button>
        <Link href="/">{t("notFound.backHome")}</Link>
      </Button>
    </div>
  );
}
