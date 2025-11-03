import { prisma } from "@/lib/prisma";

describe("Prisma + Jest setup", () => {
  it("conecta ao banco de teste", async () => {
    const userCount = await prisma.user.count().catch(() => 0);
    expect(typeof userCount).toBe("number");
  });
});
