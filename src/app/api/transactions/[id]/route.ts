import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiError } from "@/lib/api-handler";
import {
  updateTransaction,
  deleteTransaction,
} from "@/lib/services/transaction-service";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await withAuth();
    const { id } = await context.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await withAuth();
    const { id } = await context.params;
    const body = await req.json();
    const transaction = await updateTransaction(id, body);
    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await withAuth();
    const { id } = await context.params;
    await deleteTransaction(id);
    return NextResponse.json({ message: "Transação removida com sucesso" });
  } catch (error) {
    return apiError(error);
  }
}
