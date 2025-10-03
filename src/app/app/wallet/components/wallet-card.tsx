import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

type WalletCardProps = {
  name: string;
  balance: number;
  lastTransaction: {
    amount: number;
    date: string;
    type: "income" | "expense";
  };
  totalIncome: number;
  totalExpense: number;
};

export default function WalletCard({
  name,
  balance,
  lastTransaction,
  totalExpense,
  totalIncome,
}: WalletCardProps) {
  return (
    <Card className="w-full rounded-2xl shadow-md border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <Wallet className="w-8 h-8" />

          <div>
            <CardTitle className="text-lg font-semibold">{name}</CardTitle>
            <CardDescription className="text-sm">Saldo atual</CardDescription>
          </div>
        </div>
        <Button variant="outline">Editar </Button>
      </CardHeader>

      <CardContent className="space-y-2 flex flex-col justify-between ">
        <p className="text-3xl font-bold ">{balance}</p>
        <p className="text-sm text-muted-foreground">
          Última movimentação:{" "}
          <span className="font-semibold text-red-500">
            {lastTransaction.amount}
          </span>{" "}
          em
          {lastTransaction.date}
        </p>
      </CardContent>

      <CardFooter className=" flex  pt-4  text-sm gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-chart-2 rounded-lg">
            <ArrowUp className="text-white" />
          </div>

          <div>
            <p className="font-medium text-lg">{totalIncome} </p>
            <span className="text-sm text-gray-400">Entradas</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <ArrowDown className="text-white" />
          </div>

          <div>
            <p className=" font-medium text-lg">{totalExpense}</p>
            <span className="text-sm text-gray-400">Saídas</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
