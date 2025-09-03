import { ChartAreaFinance } from "@/components/chart-area-interactive";
import { ChartPieDonut } from "@/components/chart-pie-donut";
import { DataTableDemo } from "@/components/data-table";
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
const Dashboard = () => {
  return (
    <div className="w-full flex flex-col gap-4">
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
            <p className="text-4xl font-bold">$1,250.00</p>
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
            <p className="text-4xl font-bold">$490.00</p>
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
            <p className="text-4xl font-bold">$150.90</p>
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
            <p className="text-4xl font-bold">$90.80</p>
          </CardContent>
          <CardFooter>
            <p>Tendências em alta neste mês</p>
          </CardFooter>
        </Card>
      </section>
      <section className="flex flex-col lg:flex-row gap-4">
        <ChartPieDonut />
        <ChartAreaFinance />
      </section>
      <section>
        <DataTableDemo />
      </section>
    </div>
  );
};

export default Dashboard;
