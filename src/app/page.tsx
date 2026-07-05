import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, PieChart, BarChart3 } from "lucide-react";
import { getServerTranslations } from "@/lib/locale";

import Link from "next/link";
import Image from "next/image";

export default async function Page() {
  const t = await getServerTranslations();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center py-20 px-6 bg-linear-to-b from-primary/10 to-background">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
          {t("landing.heroTitle")}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
          {t("landing.heroDescription")}
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">{t("landing.ctaStart")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">{t("landing.ctaDemo")}</Link>
          </Button>
        </div>
      </header>

      {/* Benefícios */}
      <section className="py-16 px-6 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center text-center p-6">
            <Wallet className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold text-lg">{t("landing.benefit1Title")}</h3>
            <p className="text-muted-foreground mt-2">
              {t("landing.benefit1Desc")}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center text-center p-6">
            <PieChart className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold text-lg">{t("landing.benefit2Title")}</h3>
            <p className="text-muted-foreground mt-2">
              {t("landing.benefit2Desc")}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center text-center p-6">
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold text-lg">{t("landing.benefit3Title")}</h3>
            <p className="text-muted-foreground mt-2">
              {t("landing.benefit3Desc")}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Print / Demonstração */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("landing.sectionTitle")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t("landing.sectionDesc")}
          </p>
          <div className="mt-10 md:block">
            <div className="rounded-xl shadow-xl border bg-background p-4">
              <div className="relative w-full h-40 sm:h-72 md:h-80 lg:h-96">
                <Image
                  src="https://i.ibb.co/GYrQstH/balancefy-dark.png"
                  alt="preview"
                  fill
                  className=" rounded-lg dark:block"
                />
                <Image
                  src="https://i.ibb.co/Kx5whCcn/balancefy.png"
                  alt="preview"
                  fill
                  className=" rounded-lg dark:hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold">{t("landing.ctaTitle")}</h2>
        <p className="mt-2 text-muted-foreground">
          {t("landing.ctaDesc")}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/register">{t("landing.signUp")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">{t("landing.signIn")}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t text-center text-sm text-muted-foreground">
        <p>
          {t("landing.footer", { year: new Date().getFullYear() })}
        </p>
      </footer>
    </div>
  );
}
