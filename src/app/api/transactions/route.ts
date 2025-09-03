import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { data: "desc" },
  });
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const body = await req.json();

  const nova = await prisma.transaction.create({
    data: {
      descricao: body.descricao,
      categoria: body.categoria,
      valor: body.valor,
      tipo: body.tipo,
    },
  });

  return NextResponse.json(nova);
}
