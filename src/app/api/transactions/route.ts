import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth/next";
import { transactionSchema } from "@/lib/schemas/transaction-schema";

// GET - lista todas as transações do usuário logado
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");

  // Se tiver month -> aplica filtro por data no ano informado
  // Se o ano não vier, usa o ano atual
  let dateFilter = {};
  if (monthParam) {
    const month = Number(monthParam);
    const year = yearParam ? Number(yearParam) : new Date().getFullYear();

    if (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12 ||
      !Number.isInteger(year)
    ) {
      return NextResponse.json(
        { error: "Parâmetros month/year inválidos" },
        { status: 400 }
      );
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

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
    include: {
      category: true,
      wallet: true,
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(transactions);
}

// POST - cria nova transação
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    body.date = new Date(body.date);

    const { description, value, categoryId, walletId, type, date } =
      transactionSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        categoryId,
        walletId,
        value,
        type,
        date: new Date(date),
        userId: user.id,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (err) {
    console.error("Erro no POST /api/transactions:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
