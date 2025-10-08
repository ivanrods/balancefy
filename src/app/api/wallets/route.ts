import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "select";
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (type === "summary") {
      const wallets = await prisma.wallet.findMany({
        where: { userId: user.id },
        include: {
          transactions: {
            where:
              month && year
                ? {
                    date: {
                      gte: new Date(Number(year), Number(month) - 1, 1),
                      lt: new Date(Number(year), Number(month), 1),
                    },
                  }
                : {}, // se não passar nada, pega todas
            select: { value: true, description: true, date: true, type: true },
            orderBy: { date: "asc" },
          },
        },
      });

      const result = wallets.map((wallet) => {
        const totalIncome = wallet.transactions
          .filter((t) => t.type === "income")
          .reduce((acc, t) => acc + t.value, 0);

        const totalExpense = wallet.transactions
          .filter((t) => t.type === "expense")
          .reduce((acc, t) => acc + t.value, 0);

        const lastTransaction = wallet.transactions.length
          ? wallet.transactions[wallet.transactions.length - 1]
          : null;

        return {
          id: wallet.id,
          name: wallet.name,
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
          lastTransaction: lastTransaction
            ? {
                amount: lastTransaction.value,
                date: lastTransaction.date.toISOString(),
                type: lastTransaction.type,
              }
            : null,
        };
      });

      return NextResponse.json(result);
    }

    // Default: select mode
    const wallets = await prisma.wallet.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
    });

    return NextResponse.json(wallets);
  } catch (err) {
    console.error("Erro ao buscar carteiras:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "O nome da cartetira é obrigatório" },
        { status: 400 }
      );
    }

    // Verifica se o usuário já tem uma carteira com esse nome
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        name,
        userId: user.id,
      },
    });

    if (existingWallet) {
      return NextResponse.json(
        { error: "Você já tem uma categoria com esse nome" },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.create({
      data: {
        name,
        userId: user.id,
      },
    });

    return NextResponse.json(wallet, { status: 201 });
  } catch (err) {
    console.error("Erro ao criar carteira:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
