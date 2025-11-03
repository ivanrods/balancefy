import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth/next";
import { categoriesSchema } from "@/lib/schemas/categories-schema";

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
      const categories = await prisma.category.findMany({
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

      const result = categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        relationship: cat.transactions.map((t) => t.description),
        value: cat.transactions.reduce((acc, t) => acc + t.value, 0),
        number: cat.transactions.length,
      }));

      return NextResponse.json(result);
    }

    // Default: select mode
    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, color: true },
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
    const { name, color } = categoriesSchema.parse(body);

    // Verifica se o usuário já tem uma categoria com esse nome
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        color,
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
        color,
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
