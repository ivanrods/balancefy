import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { getServerTranslations } from "@/lib/locale";

export async function generateMetadata() {
  const t = await getServerTranslations();
  return {
    title: t("meta.login.title"),
    description: t("meta.login.description"),
  };
}

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
