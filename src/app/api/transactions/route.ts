import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET - lista todas as transações do usuário logado
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { data: "desc" },
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
    const { descricao, categoria, valor, tipo, data } = body;

    if (!descricao || !categoria || !valor || !tipo || !data) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

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
        descricao,
        categoria,
        valor,
        tipo,
        data: new Date(data),
        userId: user.id,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (err) {
    console.error("Erro no POST /api/transactions:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
