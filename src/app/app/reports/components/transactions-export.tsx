"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/use-transactions";
import { useExportPDF } from "@/hooks/use-export-pdf";
import { usePeriod } from "@/context/period-context";
import { toast } from "sonner";

export function TransactionsExport() {
  const { mode, selectedMonth } = usePeriod();
  const currentYear = new Date().getFullYear();
  const month = mode === "month" ? selectedMonth : undefined;
  const { transactions = [] } = useTransactions({
    month,
    year: currentYear,
  });
  const { generateTransactionsPDF } = useExportPDF();
  const [isLoading, setIsLoading] = useState(false);

  const handleExportPDF = async () => {
    if (!transactions || transactions.length === 0) {
      toast.warning("Nenhuma transação para exportar");
      return;
    }

    setIsLoading(true);
    try {
      let periodLabel = "";
      if (mode === "month") {
        periodLabel = new Date(
          currentYear,
          selectedMonth - 1,
        ).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      } else {
        periodLabel = `${currentYear}`;
      }

      await generateTransactionsPDF(transactions, periodLabel);
      toast.success("PDF baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar PDF");
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
        {isLoading ? "Gerando PDF..." : "Baixar PDF"}
      </Button>
      <span className="text-sm text-muted-foreground">
        {transactions.length} transações
      </span>
    </div>
  );
}
