// src/app/api/transactions/transaction-type/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "month";
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  let dateFilter = {};
  if (month && year) {
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
    dateFilter = { date: { gte: startDate, lte: endDate } };
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      user: { email: session.user.email },
      ...dateFilter,
    },
    select: { value: true, type: true, date: true },
    orderBy: { date: "asc" },
  });

  // Agrupar conforme o período
  if (period === "week") {
    const weeklyData: Record<string, { income: number; expense: number }> = {};

    for (const t of transactions) {
      const date = new Date(t.date);
      const week = Math.ceil(date.getDate() / 7);
      const key = `Semana ${week}`;

      if (!weeklyData[key]) weeklyData[key] = { income: 0, expense: 0 };
      weeklyData[key][t.type === "income" ? "income" : "expense"] += t.value;
    }

    const chartData = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"].map(
      (week) => ({
        week,
        income: weeklyData[week]?.income || 0,
        expense: weeklyData[week]?.expense || 0,
      })
    );

    return NextResponse.json(chartData);
  }

  // Caso contrário, agrupa por mês
  const monthlyData: Record<string, { income: number; expense: number }> = {};
  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  for (const t of transactions) {
    const date = new Date(t.date);
    const monthKey = monthNames[date.getMonth()];

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    monthlyData[monthKey][t.type === "income" ? "income" : "expense"] +=
      t.value;
  }

  const chartData = monthNames.map((m) => ({
    month: m,
    income: monthlyData[m]?.income || 0,
    expense: monthlyData[m]?.expense || 0,
  }));

  return NextResponse.json(chartData);
}
