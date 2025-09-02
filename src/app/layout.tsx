import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import "./globals.css";
import { AppHeader } from "@/components/app-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Balancefy",
  description:
    "Gerenciamento de finanças pessoais, onde o usuário pode registrar entradas e saídas, visualizar relatórios com gráficos e acompanhar sua saúde financeira.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full `}
      >
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
      </body>
    </html>
  );
}
