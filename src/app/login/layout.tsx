import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Entrar | Balancefy",
  description:
    "Acesse sua conta Balancefy e retome o controle das suas finanças pessoais com segurança e praticidade.",
};

export default async function LoginLayout({
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
