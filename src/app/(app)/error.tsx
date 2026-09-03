"use client";

import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw } from "lucide-react";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <Database className="h-10 w-10 text-destructive" aria-hidden="true" />
      <h1 className="text-2xl font-bold">{t("databaseError.title")}</h1>
      <p className="max-w-lg text-muted-foreground">{t("databaseError.description")}</p>
      <p className="text-sm text-muted-foreground">{t("databaseError.support")}</p>
      <Button onClick={reset} className="gap-2">
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        {t("common.tryAgain")}
      </Button>
    </main>
  );
}
