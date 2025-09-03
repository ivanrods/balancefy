import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full dark`}
      >
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
