import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, PieChart, BarChart3 } from "lucide-react";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";

import Link from "next/link";
import Image from "next/image";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/app/dashboard");
  }
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-b from-primary/10 to-background">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
          Controle suas finanças com facilidade
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
          Balancefy ajuda você a gerenciar categorias, relatórios e sua carteira
          em um só lugar. Organize, acompanhe e alcance suas metas financeiras.
        </p>
        <div className="mt-8 flex gap-4">
          <Button size="lg">
            <Link href="/app/dashboard">Começar agora</Link>{" "}
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/app/dashboard"> Ver demonstração</Link>
          </Button>
        </div>
      </header>

      {/* Benefícios */}
      <section className="py-16 px-6 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center text-center p-6">
            <Wallet className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold text-lg">Carteira unificada</h3>
            <p className="text-muted-foreground mt-2">
              Veja todos os seus saldos e contas em um só painel simples e
              organizado.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center text-center p-6">
            <PieChart className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold text-lg">Relatórios inteligentes</h3>
            <p className="text-muted-foreground mt-2">
              Descubra para onde vai seu dinheiro com relatórios claros e
              gráficos intuitivos.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center text-center p-6">
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold text-lg">Metas financeiras</h3>
            <p className="text-muted-foreground mt-2">
              Defina objetivos e acompanhe seu progresso rumo à liberdade
              financeira.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Print / Demonstração */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Simples, rápido e eficiente
          </h2>
          <p className="mt-4 text-muted-foreground">
            Uma interface moderna e intuitiva feita para você ter controle total
            sem complicação.
          </p>
          <div className="mt-10 hidden md:block">
            <div className="rounded-xl shadow-xl border bg-background p-4">
              <div className="relative w-full h-[450px]">
                <Image
                  src="https://i.ibb.co/GYrQstH/balancefy-dark.png"
                  alt="preview"
                  fill
                  className="object-cover rounded-lg dark:block"
                />
                <Image
                  src="https://i.ibb.co/Kx5whCcn/balancefy.png"
                  alt="preview"
                  fill
                  className="object-cover rounded-lg dark:hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold">Pronto para começar?</h2>
        <p className="mt-2 text-muted-foreground">
          Cadastre-se agora e organize suas finanças em minutos.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button size="lg">
            <Link href="/register">Criar conta</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/login">Entrar</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Balancefy. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
