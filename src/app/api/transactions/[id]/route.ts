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

  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id },
  });

  if (!transaction) {
    return NextResponse.json(
      { error: "Transação não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(transaction);
}

// PATCH - atualizar transação
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { descricao, categoria, valor, tipo, data } = body;

  try {
    const updated = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        descricao,
        categoria,
        valor,
        tipo,
        data,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Transação não encontrada" },
      { status: 404 }
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
    await prisma.transaction.delete({
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
