"use client";
import { useSummaryAll } from "@/hooks/use-summary-all";
import { formatCurrency } from "@/utils/format-currency";
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
import { useTransactions } from "@/hooks/use-transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { useSummaryMonth } from "@/hooks/use-summary-month";
import { usePeriod } from "@/context/period-context";

const Summary = () => {
  const { mode } = usePeriod();

  const { incomeAll, expenseAll, balanceAll, economyAll } = useSummaryAll();
  const { incomeMonth, expenseMonth, economyMonth } = useSummaryMonth();

  // Escolhe qual conjunto de dados exibir com base no modo
  const income = mode === "month" ? incomeMonth : incomeAll;
  const expense = mode === "month" ? expenseMonth : expenseAll;
  const balance = mode === "month" ? balanceAll : balanceAll;
  const economy = mode === "month" ? economyMonth : economyAll;

  const { isLoading } = useTransactions();

  if (isLoading) {
    return <Skeleton className="w-full h-52 rounded-xl animate-pulse" />;
  }

  const dateToday = new Date().toLocaleString("pt-BR", { month: "long" });

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Saldo Atual</CardTitle>
          <CardDescription>Receita total</CardDescription>
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
            {formatCurrency(balance)}
          </p>
        </CardContent>
        <CardFooter>
          <p>Tendências em todo o período</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entradas</CardTitle>
          <CardDescription>
            {mode === "month" ? (
              <p>Total recebido no mês atual</p>
            ) : (
              <p>Total recebido em todo o período</p>
            )}
          </CardDescription>
          <CardAction>
            <ChartNoAxesCombined />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold wrap-break-word">
            {formatCurrency(income)}
          </p>
        </CardContent>
        <CardFooter>
          {mode === "month" ? (
            <p>Tendências no mês de {dateToday}</p>
          ) : (
            <p>Tendências em todo o período</p>
          )}
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Saídas</CardTitle>
          <CardDescription>
            {mode === "month" ? (
              <p>Total gastos no mês atual</p>
            ) : (
              <p>Total gastos em todo o período</p>
            )}
          </CardDescription>
          <CardAction>
            <TrendingDown />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold wrap-break-word">
            {formatCurrency(expense)}
          </p>
        </CardContent>
        <CardFooter>
          {mode === "month" ? (
            <p> Tendências no mês de {dateToday}</p>
          ) : (
            <p>Tendências em todo o período</p>
          )}
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Economia</CardTitle>
          <CardDescription>
            {mode === "month" ? (
              <p>Total economizado no mês atual</p>
            ) : (
              <p>Total economizado em todo o período</p>
            )}
          </CardDescription>
          <CardAction>
            <DollarSign />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold wrap-break-word">
            {formatCurrency(economy)}
          </p>
        </CardContent>
        <CardFooter>
          {mode === "month" ? (
            <p>Tendências no mês de {dateToday}</p>
          ) : (
            <p>Tendências em todo o período</p>
          )}
        </CardFooter>
      </Card>
    </section>
  );
};

export default Summary;
