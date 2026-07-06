import { prisma } from "@/lib/prisma";

type CategorySummaryParams = {
  userId: string;
  month?: number | null;
  year?: number | null;
};

export async function getCategoriesSummary({
  userId,
  month,
  year,
}: CategorySummaryParams) {
  const hasMonthFilter = month != null;
  const yearNum = year ?? new Date().getFullYear();
  const dateFilter = hasMonthFilter
    ? { gte: new Date(yearNum, month! - 1, 1), lt: new Date(yearNum, month!, 1) }
    : {};

  const categories = await prisma.category.findMany({
    where: { userId },
  });

  const categoryIds = categories.map((c) => c.id);

  const [aggregation, allDescriptions] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["categoryId", "type"],
      where: {
        categoryId: { in: categoryIds },
        ...(hasMonthFilter ? { date: dateFilter } : {}),
      },
      _sum: { value: true },
      _count: true,
    }),
    hasMonthFilter
      ? prisma.transaction.findMany({
          where: { categoryId: { in: categoryIds }, date: dateFilter },
          select: { description: true, categoryId: true },
          orderBy: { date: "desc" },
          take: 500,
        })
      : prisma.transaction.findMany({
          where: { categoryId: { in: categoryIds } },
          select: { description: true, categoryId: true },
          orderBy: { date: "desc" },
          take: 500,
        }),
  ]);

  const summaryMap = new Map<
    string,
    { value: number; number: number; descriptions: string[] }
  >();

  for (const id of categoryIds) {
    summaryMap.set(id, { value: 0, number: 0, descriptions: [] });
  }

  for (const t of aggregation) {
    const entry = summaryMap.get(t.categoryId);
    if (entry) {
      entry.value += t._sum.value ?? 0;
      entry.number += t._count;
    }
  }

  for (const t of allDescriptions) {
    const entry = summaryMap.get(t.categoryId);
    if (entry && !entry.descriptions.includes(t.description)) {
      entry.descriptions.push(t.description);
    }
  }

  return categories.map((cat) => {
    const summary = summaryMap.get(cat.id)!;
    return {
      id: cat.id,
      name: cat.name,
      color: cat.color,
      value: summary.value,
      number: summary.number,
      relationship: summary.descriptions,
    };
  });
}
