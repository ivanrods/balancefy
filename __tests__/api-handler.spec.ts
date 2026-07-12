import { NextResponse } from "next/server";
import {
  UnauthorizedError,
  NotFoundError,
  withAuth,
  apiError,
} from "@/lib/api-handler";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      json: () => Promise.resolve(body),
    })),
  },
}));

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: jest.fn() } },
}));

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

const mockSession = jest.mocked(getServerSession);
const mockFindUnique = prisma.user.findUnique as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("UnauthorizedError", () => {
  it("cria erro com mensagem padrão", () => {
    const err = new UnauthorizedError();
    expect(err.message).toBe("Unauthorized");
  });
});

describe("NotFoundError", () => {
  it("cria erro com nome da entidade", () => {
    const err = new NotFoundError("Transaction");
    expect(err.message).toBe("Transaction not found");
  });
});

describe("apiError", () => {
  it("retorna 401 para UnauthorizedError", async () => {
    const res = apiError(new UnauthorizedError()) as NextResponse;
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("retorna 404 para NotFoundError", async () => {
    const res = apiError(new NotFoundError("User")) as NextResponse;
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("User not found");
  });

  it("retorna 400 para Error genérico", async () => {
    const res = apiError(new Error("Campo inválido")) as NextResponse;
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Campo inválido");
  });

  it("retorna 500 para erro desconhecido", async () => {
    const res = apiError("string qualquer") as NextResponse;
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Internal server error");
  });
});

describe("withAuth", () => {
  it("lança UnauthorizedError sem sessão", async () => {
    mockSession.mockResolvedValue(null);
    await expect(withAuth()).rejects.toThrow(UnauthorizedError);
  });

  it("lança UnauthorizedError sem email na sessão", async () => {
    mockSession.mockResolvedValue({ user: {} });
    await expect(withAuth()).rejects.toThrow(UnauthorizedError);
  });

  it("lança NotFoundError quando usuário não existe no banco", async () => {
    mockSession.mockResolvedValue({ user: { email: "x@y.com" } });
    mockFindUnique.mockResolvedValue(null);
    await expect(withAuth()).rejects.toThrow(NotFoundError);
  });

  it("retorna usuário com id e email quando autenticado", async () => {
    mockSession.mockResolvedValue({ user: { email: "a@b.com" } });
    mockFindUnique.mockResolvedValue({ id: "abc", email: "a@b.com" });
    const user = await withAuth();
    expect(user).toEqual({ id: "abc", email: "a@b.com" });
  });
});
