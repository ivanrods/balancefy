import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth/next";
import { getServerLocale } from "@/lib/locale";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const locale = await getServerLocale();
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: locale === "en" ? "USD" : "BRL",
  });

  const now = new Date();

  const dueTransactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      type: "expense",
      date: { lte: now },
      notifications: { none: {} },
    },
  });

  for (const transaction of dueTransactions) {
    const formattedValue = currencyFormatter.format(transaction.value);
    const typeLabel = transaction.type === "income"
      ? (locale === "en" ? "income" : "entrada")
      : (locale === "en" ? "expense" : "saída");

    const message = locale === "en"
      ? `Transaction '${transaction.description}' of ${formattedValue} (${typeLabel}) is due today!`
      : `Transação '${transaction.description}' de ${formattedValue} (${typeLabel}) venceu hoje!`;

    await prisma.notification.create({
      data: {
        userId: user.id,
        transactionId: transaction.id,
        message,
      },
    });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id, read: false },
    orderBy: { createdAt: "desc" },
    include: {
      transaction: {
        select: {
          id: true,
          description: true,
          value: true,
          type: true,
          date: true,
        },
      },
    },
  });

  return NextResponse.json(notifications);
}
