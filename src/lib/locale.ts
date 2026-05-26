import { cookies } from "next/headers";
import { getTranslations } from "@/i18n";

export type Locale = "pt-BR" | "en";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;
  if (locale === "pt-BR" || locale === "en") return locale;
  return "pt-BR";
}

export async function getServerTranslations() {
  const locale = await getServerLocale();
  return getTranslations(locale);
}
