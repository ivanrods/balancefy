// src/app/api/transactions/summary/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // Pega o usuário logado
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  // Busca as transações do usuário
  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    select: {
      value: true,
      type: true,
      date: true,
    },
  });

  // Agrupa por mês
  const monthlyData: Record<string, { income: number; expense: number }> = {};

  for (const t of transactions) {
    const date = new Date(t.date);
    const monthKey = date.toLocaleString("en-US", { month: "long" });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthlyData[monthKey].income += t.value;
    } else {
      monthlyData[monthKey].expense += t.value;
    }
  }

  // Converte para array e garante ordem cronológica
  const chartData = Object.keys(monthlyData)
    .map((month) => ({
      month,
      income: monthlyData[month].income,
      expense: monthlyData[month].expense,
    }))
    .sort(
      (a, b) =>
        new Date(`${a.month} 1, 2025`).getMonth() -
        new Date(`${b.month} 1, 2025`).getMonth()
    );

  return NextResponse.json(chartData);
}
