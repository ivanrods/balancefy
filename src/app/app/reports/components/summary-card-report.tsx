import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency";
import { ArrowDown, ArrowUp } from "lucide-react";
import Image from "next/image";

type SummaryCardReportProps = {
  title: string;
  value: string;
  income: number;
  expense: number;

  positive?: boolean;
};

export default function SummaryCardReport({
  title,
  value,
  income,
  expense,
}: SummaryCardReportProps) {
  return (
    <Card className="w-full h-full flex flex-row justify-between">
      <div className="h-full flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm ">
            <p>
              Evolução do saldo ao longo de{" "}
              <span className="font-semibold text-primary">{value}</span>,
              destacando variações entre entradas e saídas.
            </p>

            <p>
              Distribuição dos{" "}
              <span className="font-semibold text-primary">
                gastos por categoria
              </span>{" "}
              referente ao período de {value}, permitindo identificar onde está
              concentrada a maior parte das despesas.
            </p>

            <p>
              Comparativo dos{" "}
              <span className="font-semibold text-primary">
                valores de entradas e saídas
              </span>{" "}
              durante {value}, facilitando a visualização do saldo líquido no
              período.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex pt-4  text-sm gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-chart-2 rounded-lg">
              <ArrowUp className="text-white" />
            </div>

            <div>
              <p className="font-medium text-lg">{formatCurrency(income)} </p>
              <span className="text-sm text-gray-400">Entradas</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <ArrowDown className="text-white" />
            </div>

            <div>
              <p className=" font-medium text-lg">{formatCurrency(expense)}</p>
              <span className="text-sm text-gray-400">Saídas</span>
            </div>
          </div>
        </CardFooter>
      </div>

      <Image
        src="https://i.ibb.co/DhYnrxK/grafc.webp"
        width={300}
        height={300}
        alt="Picture of the author"
        className="mx-4 rounded-2xl hidden lg:block"
      />
    </Card>
  );
}
