"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/use-transactions";
import { useExportPDF } from "@/hooks/use-export-pdf";
import { usePeriod } from "@/context/period-context";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";
import { Transaction } from "@/types/transaction";

type TransactionsExportProps = {
  initialTransactions?: Transaction[];
};

export function TransactionsExport({ initialTransactions }: TransactionsExportProps) {
  const { t, locale } = useTranslation();
  const { mode, selectedMonth } = usePeriod();
  const currentYear = new Date().getFullYear();
  const month = mode === "month" ? selectedMonth : undefined;
  const { transactions = [] } = useTransactions(
    {
      month,
      year: currentYear,
    },
    initialTransactions,
  );
  const { generateTransactionsPDF } = useExportPDF();
  const [isLoading, setIsLoading] = useState(false);

  const handleExportPDF = async () => {
    if (!transactions || transactions.length === 0) {
      toast.warning(t("exportPdf.noTransactions"));
      return;
    }

    setIsLoading(true);
    try {
      let periodLabel = "";
      if (mode === "month") {
        periodLabel = new Date(currentYear, selectedMonth - 1).toLocaleDateString(locale, {
          month: "long",
          year: "numeric",
        });
      } else {
        periodLabel = `${currentYear}`;
      }

      await generateTransactionsPDF(transactions, periodLabel, locale, t);
      toast.success(t("exportPdf.pdfDownloaded"));
    } catch (error) {
      toast.error(t("exportPdf.pdfGeneratedError"));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleExportPDF}
        disabled={isLoading || transactions.length === 0}
        variant="outline"
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        {isLoading ? t("exportPdf.generating") : t("reports.exportPDF")}
      </Button>
      <span className="text-sm text-muted-foreground">
        {transactions.length} {t("reports.transactionHistory")?.toLowerCase() || ""}
      </span>
    </div>
  );
}
