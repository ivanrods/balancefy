import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { walletSchema } from "@/lib/schemas/wallet-schema";
import { withAuth, apiError } from "@/lib/api-handler";
import { getWalletsSummary } from "@/lib/services/wallet-service";

export async function GET(req: Request) {
  try {
    const user = await withAuth();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "select";
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (type === "summary") {
      const result = await getWalletsSummary({
        userId: user.id,
        month: month ? Number(month) : null,
        year: year ? Number(year) : null,
      });
      return NextResponse.json(result);
    }

    const wallets = await prisma.wallet.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
    });

    return NextResponse.json(wallets);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await withAuth();
    const body = await req.json();
    const { name } = walletSchema.parse(body);

    const existingWallet = await prisma.wallet.findFirst({
      where: { name, userId: user.id },
    });

    if (existingWallet) {
      return NextResponse.json(
        { error: "Você já tem uma carteira com esse nome" },
        { status: 400 },
      );
    }

    const wallet = await prisma.wallet.create({
      data: { name, userId: user.id },
    });

    return NextResponse.json(wallet, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
