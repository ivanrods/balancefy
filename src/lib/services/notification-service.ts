import { prisma } from "@/lib/prisma";
import { getServerLocale } from "@/lib/locale";

export async function getNotifications(userId: string) {
  const locale = await getServerLocale();
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: locale === "en" ? "USD" : "BRL",
  });

  const now = new Date();

  const dueTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: "expense",
      date: { lte: now },
      notifications: { none: {} },
    },
  });

  for (const transaction of dueTransactions) {
    const formattedValue = currencyFormatter.format(transaction.value);
    const typeLabel =
      transaction.type === "income"
        ? locale === "en"
          ? "income"
          : "entrada"
        : locale === "en"
          ? "expense"
          : "saída";

    const message =
      locale === "en"
        ? `Transaction '${transaction.description}' of ${formattedValue} (${typeLabel}) is due today!`
        : `Transação '${transaction.description}' de ${formattedValue} (${typeLabel}) venceu hoje!`;

    await prisma.notification.create({
      data: {
        userId,
        transactionId: transaction.id,
        message,
      },
    });
  }

  return prisma.notification.findMany({
    where: { userId, read: false },
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
}
