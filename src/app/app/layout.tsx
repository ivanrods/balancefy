import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { AppHeader } from "@/components/app-header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
