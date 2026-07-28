import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categoriesSchema } from "@/lib/schemas/categories-schema";
import { withAuth, apiError } from "@/lib/api-handler";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await context.params;

    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await context.params;
    const body = await req.json();
    const { name, color } = categoriesSchema.parse(body);

    const category = await prisma.category.update({
      where: { id },
      data: { name, color },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await context.params;

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ message: "Categoria removida com sucesso" });
  } catch (error) {
    return apiError(error);
  }
}
