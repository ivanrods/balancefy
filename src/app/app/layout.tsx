import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { AppHeader } from "@/components/header/app-header";
import { PeriodProvider } from "@/context/period-context";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full bg-sidebar md:p-3">
          <div className="w-full h-full flex flex-col gap-4 px-4 bg-background md:rounded-xl">
            <AppHeader />
            <PeriodProvider>{children}</PeriodProvider>
          </div>
        </main>
      </SidebarProvider>
    </Providers>
  );
}
