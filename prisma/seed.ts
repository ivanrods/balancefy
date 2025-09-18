import { prisma } from "../src/lib/prisma";

async function main() {
  const defaultCategories = [
    { name: "Food" },
    { name: "Transport" },
    { name: "Housing" },
    { name: "Leisure" },
    { name: "Others" },
  ];

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
}

main().finally(() => prisma.$disconnect());
