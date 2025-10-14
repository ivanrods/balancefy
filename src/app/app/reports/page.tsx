"use client";
import { PeriodFilterHeader } from "@/components/period-filter-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <PeriodFilterHeader title=" Relatórios Financeiros" />

      {/* 🧾 Cards Comparativos */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ResumoCard titulo="Período" valor="Out 2025" />
        <ResumoCard titulo="Entradas" valor="+12%" positivo />
        <ResumoCard titulo="Saídas" valor="-5%" positivo />
        <ResumoCard titulo="Saldo Médio" valor="R$ 1.245,00" />
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

/* Componente de Card de Resumo */
type ResumoCardProps = {
  titulo: string;
  valor: string;
  positivo?: boolean;
};

function ResumoCard({ titulo, valor, positivo }: ResumoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-xl font-semibold ${
            positivo
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {valor}
        </p>
      </CardContent>
    </Card>
  );
}
