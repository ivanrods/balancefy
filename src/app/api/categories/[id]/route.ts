import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET - detalhe de uma transação
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.category.findUnique({
    where: { id: params.id },
  });

  if (!categories) {
    return NextResponse.json(
      { error: "Categoria não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(categories);
}

// PUT - atualizar transação
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { name } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Todos os campos são obrigatórios" },
      { status: 400 }
    );
  }

  try {
    const categories = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
      { status: 500 }
    );
  }
}

// DELETE - remover transação
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Transação removida com sucesso" });
  } catch {
    return NextResponse.json(
      { error: "Transação não encontrada" },
      { status: 404 }
    );
  }
}
