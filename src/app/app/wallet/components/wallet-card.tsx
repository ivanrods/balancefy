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

export default function WalletCard() {
  return (
    <Card className="w-full rounded-2xl shadow-md border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <Wallet className="w-8 h-8" />

          <div>
            <CardTitle className="text-lg font-semibold">Nubank</CardTitle>
            <CardDescription className="text-sm">Saldo atual</CardDescription>
          </div>
        </div>
        <Button variant="outline">Editar </Button>
      </CardHeader>

      <CardContent className="space-y-2 flex flex-col justify-between ">
        <p className="text-3xl font-bold ">R$ 2.350,00</p>
        <p className="text-sm text-muted-foreground">
          Última movimentação:{" "}
          <span className="font-semibold text-red-500">-R$ 120,00</span> em
          28/09
        </p>
      </CardContent>

      <CardFooter className=" flex  pt-4  text-sm gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-chart-2 rounded-lg">
            <ArrowUp className="text-white" />
          </div>

          <div>
            <p className="font-medium text-lg">+R$ 2000 </p>
            <span className="text-sm text-gray-400">Entradas</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <ArrowDown className="text-white" />
          </div>

          <div>
            <p className=" font-medium text-lg">-R$ 1200 </p>
            <span className="text-sm text-gray-400">Saídas</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
