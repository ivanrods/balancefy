import { NextResponse } from "next/server";

export async function GET() {
  const categories = [
    { id: "Alimentacao", name: "Alimentação" },
    { id: "Transporte", name: "Transporte" },
    { id: "Moradia", name: "Moradia" },
    { id: "Lazer", name: "Lazer" },
    { id: "Outros", name: "Outros" },
  ];

  return NextResponse.json(categories);
}
