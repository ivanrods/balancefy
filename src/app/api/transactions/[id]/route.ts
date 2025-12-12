import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth/next";
import { transactionSchema } from "@/lib/schemas/transaction-schema";

// GET - detalhe de uma transação
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction) {
    return NextResponse.json(
      { error: "Transação não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(transaction);
}

// PUT - atualizar transação
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  body.date = new Date(body.date);

  const { description, categoryId, walletId, value, type, date } =
    transactionSchema.parse(body);

  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        description,
        categoryId,
        walletId,
        value,
        type,
        date,
      },
    });

    return NextResponse.json(transaction, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar transação" },
      { status: 500 }
    );
  }
}

// DELETE - remover transação
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Transação removida com sucesso" });
  } catch {
    return NextResponse.json(
      { error: "Transação não encontrada" },
      { status: 404 }
    );
  }
}
