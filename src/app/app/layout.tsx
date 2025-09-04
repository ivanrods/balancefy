import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar />

        <main className="w-full">
          <AppHeader />
          <div className="w-full flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Finance Dashboard</h1>
            {children}
          </div>
        </main>
      </SidebarProvider>
    </Providers>
  );
}
