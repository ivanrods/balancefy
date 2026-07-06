import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categoriesSchema } from "@/lib/schemas/categories-schema";
import { withAuth, apiError } from "@/lib/api-handler";
import { getCategoriesSummary } from "@/lib/services/category-service";

export async function GET(req: Request) {
  try {
    const user = await withAuth();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "select";
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (type === "summary") {
      const result = await getCategoriesSummary({
        userId: user.id,
        month: month ? Number(month) : null,
        year: year ? Number(year) : null,
      });
      return NextResponse.json(result);
    }

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, color: true },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await withAuth();
    const body = await req.json();
    const { name, color } = categoriesSchema.parse(body);

    const existingCategory = await prisma.category.findFirst({
      where: { name, userId: user.id },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Você já tem uma categoria com esse nome" },
        { status: 400 },
      );
    }

    const category = await prisma.category.create({
      data: { name, color, userId: user.id },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
