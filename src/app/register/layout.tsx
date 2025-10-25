import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Criar Conta | Balancefy",
  description:
    "Crie sua conta gratuita e comece a organizar suas finanças de forma inteligente. Leve o controle do seu dinheiro para o próximo nível.",
};

export default async function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/app/dashboard");
  }

  return <>{children}</>;
}
