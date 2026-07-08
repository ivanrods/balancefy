"use client";
import { useSummaryAll } from "@/hooks/use-summary-all";
import { formatCurrency } from "@/utils/format-currency";
import { useCurrency } from "@/context/currency-context";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartNoAxesCombined,
  CircleDollarSign,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSummaryMonth } from "@/hooks/use-summary-month";
import { usePeriod } from "@/context/period-context";
import { useTranslation } from "@/hooks/use-translation";
import { Transaction } from "@/types/transaction";

type SummaryProps = {
  initialTransactions?: Transaction[];
};

const Summary = ({ initialTransactions }: SummaryProps) => {
  const { mode, selectedMonth } = usePeriod();
  const { t, locale } = useTranslation();
  const { currency } = useCurrency();

  const { incomeAll, expenseAll, balanceAll, economyAll, isLoading: isLoadingAll } = useSummaryAll(initialTransactions);
  const { incomeMonth, expenseMonth, balanceMonth, economyMonth, isLoading: isLoadingMonth } =
    useSummaryMonth(initialTransactions);

  const isLoading = mode === "month" ? isLoadingMonth : isLoadingAll;

  // Escolhe qual conjunto de dados exibir com base no modo
  const income = mode === "month" ? incomeMonth : incomeAll;
  const expense = mode === "month" ? expenseMonth : expenseAll;
  const balance = mode === "month" ? balanceMonth : balanceAll;
  const economy = mode === "month" ? economyMonth : economyAll;

  if (isLoading) {
    return <Skeleton className="w-full h-52 rounded-xl animate-pulse" />;
  }

  const monthNames = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return date.toLocaleDateString(locale, { month: "long" });
  });
  const dateToday =
    monthNames[selectedMonth - 1] ?? monthNames[new Date().getMonth()];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("summary.currentBalance")}</CardTitle>
          <CardDescription>{t("summary.totalRevenue")}</CardDescription>
          <CardAction>
            <CircleDollarSign />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p
            className={`text-4xl font-bold wrap-break-word ${
              balance < 0 ? "text-primary" : "text-chart-2"
            }`}
          >
            {formatCurrency(balance, currency)}
          </p>
        </CardContent>
        <CardFooter>
          <p>{t("summary.trendsPeriod")}</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("summary.income")}</CardTitle>
          <CardDescription>
            {mode === "month" ? (
              <p>{t("summary.totalReceivedMonth")}</p>
            ) : (
              <p>{t("summary.totalReceivedPeriod")}</p>
            )}
          </CardDescription>
          <CardAction>
            <ChartNoAxesCombined />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold wrap-break-word">
            {formatCurrency(income, currency)}
          </p>
        </CardContent>
        <CardFooter>
          {mode === "month" ? (
            <p>{t("summary.trendsMonth", { month: dateToday })}</p>
          ) : (
            <p>{t("summary.trendsPeriod")}</p>
          )}
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("summary.expenses")}</CardTitle>
          <CardDescription>
            {mode === "month" ? (
              <p>{t("summary.totalSpentMonth")}</p>
            ) : (
              <p>{t("summary.totalSpentPeriod")}</p>
            )}
          </CardDescription>
          <CardAction>
            <TrendingDown />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold wrap-break-word">
            {formatCurrency(expense, currency)}
          </p>
        </CardContent>
        <CardFooter>
          {mode === "month" ? (
            <p>{t("summary.trendsMonth", { month: dateToday })}</p>
          ) : (
            <p>{t("summary.trendsPeriod")}</p>
          )}
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("summary.savings")}</CardTitle>
          <CardDescription>
            {mode === "month" ? (
              <p>{t("summary.totalSavedMonth")}</p>
            ) : (
              <p>{t("summary.totalSavedPeriod")}</p>
            )}
          </CardDescription>
          <CardAction>
            <DollarSign />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold wrap-break-word">
            {formatCurrency(economy, currency)}
          </p>
        </CardContent>
        <CardFooter>
          {mode === "month" ? (
            <p>{t("summary.trendsMonth", { month: dateToday })}</p>
          ) : (
            <p>{t("summary.trendsPeriod")}</p>
          )}
        </CardFooter>
      </Card>
    </section>
  );
};

export default Summary;
