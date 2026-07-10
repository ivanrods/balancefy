import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { walletSchema } from "@/lib/schemas/wallet-schema";
import { withAuth, apiError } from "@/lib/api-handler";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await withAuth();
    const { id } = await context.params;

    const wallet = await prisma.wallet.findUnique({ where: { id } });

    if (!wallet) {
      return NextResponse.json(
        { error: "Carteira não encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(wallet);
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
    const { name } = walletSchema.parse(body);

    const wallet = await prisma.wallet.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(wallet, { status: 200 });
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

    await prisma.wallet.delete({ where: { id } });

    return NextResponse.json({ message: "Carteira removida com sucesso" });
  } catch (error) {
    return apiError(error);
  }
}
