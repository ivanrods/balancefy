import { useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/utils/format-currency";
import { useCurrency } from "@/context/currency-context";

export function useExportPDF() {
  const { currency } = useCurrency();
  const generateTransactionsPDF = useCallback(
    async (
      transactions: Transaction[],
      periodLabel: string,
      locale: string = "pt-BR",
      t?: (key: string) => string,
    ) => {
      const _t = t || ((key: string) => key);
      try {
        const doc = new jsPDF();
        const margin = 15;
        let yPosition = margin;

        doc.setFontSize(16);
        doc.text(_t("exportPdf.title"), margin, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`${_t("exportPdf.period")}: ${periodLabel}`, margin, yPosition);
        yPosition += 8;
        doc.setTextColor(0);

        doc.setFontSize(9);
        doc.text(
          `${_t("exportPdf.generatedOn")}: ${new Date().toLocaleDateString(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}`,
          margin,
          yPosition,
        );
        yPosition += 8;

        const totalIncome = transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.value, 0);
        const totalExpense = transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.value, 0);
        const balance = totalIncome - totalExpense;

        doc.setFontSize(11);
        doc.setFont("", "bold");
        doc.text(_t("exportPdf.financialSummary"), margin, yPosition);
        yPosition += 6;

        doc.setFontSize(10);
        doc.setFont("", "normal");
        doc.text(
          `${_t("exportPdf.totalIncome")}: ${formatCurrency(totalIncome, currency, locale)}`,
          margin,
          yPosition,
        );
        yPosition += 5;
        doc.text(
          `${_t("exportPdf.totalExpenses")}: ${formatCurrency(totalExpense, currency, locale)}`,
          margin,
          yPosition,
        );
        yPosition += 5;
        doc.text(`${_t("exportPdf.balance")}: ${formatCurrency(balance, currency, locale)}`, margin, yPosition);
        yPosition += 10;

        const columns = [
          _t("table.date"),
          _t("table.description"),
          _t("table.category"),
          _t("table.type"),
          _t("table.value"),
        ];
        const tableData = transactions.map((t) => [
          new Date(t.date).toLocaleDateString(locale),
          t.description.length > 20
            ? t.description.substring(0, 20) + "..."
            : t.description,
          t.category.name,
          t.type === "income" ? _t("table.typeIncome") : _t("table.typeExpense"),
          formatCurrency(t.value, currency, locale),
        ]);

        autoTable(doc, {
          head: [columns],
          body: tableData,
          startY: yPosition,
          margin: { left: margin, right: margin },
          headStyles: {
            fillColor: [51, 102, 255],
            textColor: 255,
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [240, 245, 255],
          },
          bodyStyles: {
            textColor: 0,
          },
          columnStyles: {
            3: { halign: "center" },
            4: { halign: "right" },
          },
        });

        const fileName = `transactions_${new Date().getTime()}.pdf`;
        doc.save(fileName);

        return { success: true, message: _t("exportPdf.pdfGeneratedSuccess") };
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        return { success: false, message: _t("exportPdf.pdfGeneratedError") };
      }
    },
    [currency],
  );

  return { generateTransactionsPDF };
}
