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
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  let dateFilter = {};
  if (month && year) {
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);

    dateFilter = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      user: { email: session.user.email },
      ...dateFilter,
    },
    select: {
      value: true,
      type: true,
      date: true,
    },
    orderBy: { date: "asc" },
  });

  const monthlyData: Record<string, { income: number; expense: number }> = {};

  for (const t of transactions) {
    const date = new Date(t.date);
    const monthKey = date.toLocaleString("pt-BR", { month: "long" });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthlyData[monthKey].income += t.value;
    } else {
      monthlyData[monthKey].expense += t.value;
    }
  }

  const chartData = Object.keys(monthlyData)
    .map((month) => ({
      month,
      income: monthlyData[month].income,
      expense: monthlyData[month].expense,
    }))
    .sort(
      (a, b) =>
        new Date(`${a.month} 1, ${year || 2025}`).getMonth() -
        new Date(`${b.month} 1, ${year || 2025}`).getMonth()
    );

  return NextResponse.json(chartData);
}
