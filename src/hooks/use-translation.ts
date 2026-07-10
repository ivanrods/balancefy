"use client";

import { useMemo } from "react";
import { useLocale, Locale } from "@/context/locale-context";
import { getTranslations } from "@/i18n";

export function useTranslation() {
  const { locale, setLocale } = useLocale();
  const t = useMemo(() => getTranslations(locale as Locale), [locale]);

  return { t, locale: locale as Locale, setLocale };
}
