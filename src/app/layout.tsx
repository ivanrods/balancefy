import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/context/theme-context";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Balancefy",
  description:
    "Gerenciamento de finanças pessoais, onde o usuário pode registrar entradas e saídas, visualizar relatórios com gráficos e acompanhar sua saúde financeira.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Script para aplicar o tema instantaneamente */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <Providers>
        <ThemeProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased w-full `}
          >
            <main className="w-full">{children}</main>
            <Toaster />
          </body>
        </ThemeProvider>
      </Providers>
    </html>
  );
}
