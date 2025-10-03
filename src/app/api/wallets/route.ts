import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "select";

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
          transactions: { select: { value: true, description: true } },
        },
      });

      const result = wallets.map((wallet) => ({
        id: wallet.id,
        name: wallet.name,
        relationship: wallet.transactions.map((t) => t.description),
        value: wallet.transactions.reduce((acc, t) => acc + t.value, 0),
        number: wallet.transactions.length,
      }));

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
