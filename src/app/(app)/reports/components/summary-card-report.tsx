"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency";
import { useCurrency } from "@/context/currency-context";
import { ArrowDown, ArrowUp } from "lucide-react";
import { usePeriod } from "@/context/period-context";
import { useSummaryReportAll } from "@/hooks/use-summary-report-all";
import { useSummaryReportMonth } from "@/hooks/use-summary-report-all-month";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartPieReport } from "./chart-pie-report";
import { useTranslation } from "@/hooks/use-translation";

export default function SummaryCardReport() {
  const { t, locale } = useTranslation();
  const { mode } = usePeriod();
  const { currency } = useCurrency();

  const { incomeAll, expenseAll, isLoading } = useSummaryReportAll();

  const { incomeMonth, expenseMonth, dateToday } = useSummaryReportMonth();

  const income = mode === "month" ? incomeMonth : incomeAll;
  const expense = mode === "month" ? expenseMonth : expenseAll;
  const month = mode === "month" ? dateToday : t("reports.summaryCard.wholePeriod");

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-xl animate-pulse" />;
  }

  return (
    <Card className="w-full h-full flex flex-row justify-between">
      <div className="flex flex-col lg:flex-row w-full justify-between gap-4">
        <div className="h-full flex flex-col flex-1 justify-between ">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              {t("reports.summaryCard.spendingDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm ">
              <p>
                {t("reports.summaryCard.balanceEvolutionBefore")}{" "}
                <span className="font-semibold text-primary">{month}</span>
                {t("reports.summaryCard.balanceEvolutionAfter")}
              </p>

              <p>
                {t("reports.summaryCard.categoryDistributionBefore")}{" "}
                <span className="font-semibold text-primary">
                  {t("reports.summaryCard.categoryDistributionHighlight")}
                </span>{" "}
                {t("reports.summaryCard.categoryDistributionMiddle")} {month}
                {t("reports.summaryCard.categoryDistributionAfter")}
              </p>

              <p>
                {t("reports.summaryCard.comparisonBefore")}{" "}
                <span className="font-semibold text-primary">
                  {t("reports.summaryCard.comparisonHighlight")}
                </span>{" "}
                {t("reports.summaryCard.comparisonMiddle")} {month}
                {t("reports.summaryCard.comparisonAfter")}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap pt-4  text-sm gap-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-chart-2 rounded-lg">
                <ArrowUp className="text-white" />
              </div>

              <div>
                <p className="font-medium text-lg wrap-break-word">
                  {formatCurrency(income, currency, locale)}{" "}
                </p>
                <span className="text-sm text-gray-400">{t("reports.summaryIncome")}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <ArrowDown className="text-white" />
              </div>

              <div>
                <p className=" font-medium text-lg wrap-break-word">
                  {formatCurrency(expense, currency, locale)}
                </p>
                <span className="text-sm text-gray-400">{t("reports.summaryExpenses")}</span>
              </div>
            </div>
          </CardFooter>
        </div>
        <div className="w-full h-full px-4 lg:max-w-md">
          <ChartPieReport />
        </div>
      </div>
    </Card>
  );
}
