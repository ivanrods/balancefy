"use client";
import { useSummary } from "@/hooks/use-summary";
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
const Summary = () => {
  const { income, expense, balance, economy } = useSummary();
  const { incomeMonth, expenseMonth, balanceMonth, economyMonth } =
    useSummaryMonth();

  const { isLoading } = useTransactions();

  if (isLoading) {
    return <Skeleton className="w-full h-52 rounded-xl" />;
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Saldo Atual</CardTitle>
          <CardDescription>Receita total</CardDescription>
          <CardAction>
            <CircleDollarSign />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{formatCurrency(balance)}</p>
        </CardContent>
        <CardFooter>
          <p>Tendências em alta neste mês</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entradas</CardTitle>
          <CardDescription>Total recebido no período</CardDescription>
          <CardAction>
            <ChartNoAxesCombined />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{formatCurrency(incomeMonth)}</p>
        </CardContent>
        <CardFooter>
          <p>Tendências em alta neste mês</p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Saídas</CardTitle>
          <CardDescription>Total gasto no período</CardDescription>
          <CardAction>
            <TrendingDown />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{formatCurrency(expenseMonth)}</p>
        </CardContent>
        <CardFooter>
          <p>Tendências em alta neste mês</p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Economia</CardTitle>
          <CardDescription>Quanto conseguiu economizar</CardDescription>
          <CardAction>
            <DollarSign />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{formatCurrency(economyMonth)}</p>
        </CardContent>
        <CardFooter>
          <p>Tendências em alta neste mês</p>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Summary;
