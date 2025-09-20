import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
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

    const categories = await prisma.category.findMany({
      where: {
        OR: [{ userId: user.id }, { userId: null }],
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(categories);
  } catch (err) {
    console.error("Erro ao buscar categorias:", err);
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
        { error: "O nome da categoria é obrigatório" },
        { status: 400 }
      );
    }

    // Verifica se o usuário já tem uma categoria com esse nome
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        userId: user.id,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Você já tem uma categoria com esse nome" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        userId: user.id,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("Erro ao criar categoria:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
