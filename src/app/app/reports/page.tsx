"use client";
import { PeriodFilterHeader } from "@/components/period-filter-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryCardReport from "./components/summary-card-report";

export default function ReportsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4 mb-4">
      <PeriodFilterHeader title=" Relatórios Financeiros" />

      {/* Cards Comparativos */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCardReport title="Período" value="Out 2025" />
        <SummaryCardReport title="Entradas" value="+12%" positive />
        <SummaryCardReport title="Saídas" value="-5%" positive />
        <SummaryCardReport title="Saldo Médio" value="R$ 1.245,00" />
      </section>

      {/* Gráficos Analíticos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            [ Gráfico de Linhas aqui ]
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            [ Gráfico de Pizza aqui ]
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Comparativo por Período</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            [ Gráfico de Barras aqui ]
          </CardContent>
        </Card>
      </section>

      {/* Insights */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Insights</h2>
        <ul className="space-y-2 text-sm">
          <li> Você economizou 20% a mais este mês comparado ao anterior.</li>
          <li> Gastos com Transporte aumentaram 45% em relação à média.</li>
          <li> Sua categoria mais constante é “Moradia”.</li>
        </ul>
      </section>

      {/* Tabela */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Histórico de Transações</h2>
        <Card>
          <CardContent className="py-6 flex items-center justify-center text-muted-foreground">
            [ Tabela detalhada de transações aqui ]
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
