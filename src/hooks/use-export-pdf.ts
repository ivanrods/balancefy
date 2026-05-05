import { useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/utils/format-currency";

export function useExportPDF() {
  const generateTransactionsPDF = useCallback(
    async (transactions: Transaction[], periodLabel: string) => {
      try {
        const doc = new jsPDF();
        const margin = 15;
        let yPosition = margin;

        // Título
        doc.setFontSize(16);
        doc.text("Relatório de Transações", margin, yPosition);
        yPosition += 10;

        // Período
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Período: ${periodLabel}`, margin, yPosition);
        yPosition += 8;
        doc.setTextColor(0);

        // Data de geração
        doc.setFontSize(9);
        doc.text(
          `Gerado em: ${new Date().toLocaleDateString("pt-BR", {
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

        // Resumo
        const totalIncome = transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.value, 0);
        const totalExpense = transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.value, 0);
        const balance = totalIncome - totalExpense;

        doc.setFontSize(11);
        doc.setFont("", "bold");
        doc.text("Resumo Financeiro", margin, yPosition);
        yPosition += 6;

        doc.setFontSize(10);
        doc.setFont("", "normal");
        doc.text(
          `Total de Entradas: ${formatCurrency(totalIncome)}`,
          margin,
          yPosition,
        );
        yPosition += 5;
        doc.text(
          `Total de Saídas: ${formatCurrency(totalExpense)}`,
          margin,
          yPosition,
        );
        yPosition += 5;
        doc.text(`Saldo: ${formatCurrency(balance)}`, margin, yPosition);
        yPosition += 10;

        // Tabela de transações
        const columns = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
        const tableData = transactions.map((t) => [
          new Date(t.date).toLocaleDateString("pt-BR"),
          t.description.length > 20
            ? t.description.substring(0, 20) + "..."
            : t.description,
          t.category.name,
          t.type === "income" ? "Entrada" : "Saída",
          formatCurrency(t.value),
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

        // Salvar PDF
        const fileName = `transacoes_${new Date().getTime()}.pdf`;
        doc.save(fileName);

        return { success: true, message: "PDF gerado com sucesso!" };
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        return { success: false, message: "Erro ao gerar PDF" };
      }
    },
    [],
  );

  return { generateTransactionsPDF };
}
