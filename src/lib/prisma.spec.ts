import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";

describe("prisma", () => {
  it("exporta um PrismaClient com os métodos esperados", () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe("function");
    expect(typeof prisma.$disconnect).toBe("function");
    expect(typeof prisma.$on).toBe("function");
    expect(prisma.user).toBeDefined();
    expect(prisma.account).toBeDefined();
  });

  it("armazena a instância no globalThis para reuso em dev", () => {
    const globalPrisma = (global as unknown as { prisma?: PrismaClient }).prisma;
    expect(globalPrisma).toBe(prisma);
  });
});
