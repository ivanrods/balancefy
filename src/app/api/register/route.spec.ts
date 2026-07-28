/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { POST } from "@/app/api/register/route";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      json: () => Promise.resolve(body),
    })),
  },
  NextRequest: class NextRequest {
    body: any;
    constructor(body: any) {
      this.body = body;
    }
    json() {
      return Promise.resolve(this.body);
    }
    async text() {
      return JSON.stringify(this.body);
    }
  },
}));

jest.mock("bcryptjs", () => ({ hash: jest.fn(() => "hashed-password") }));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: jest.fn(), create: jest.fn() },
  },
}));

const mockFindUnique = prisma.user.findUnique as jest.Mock;
const mockCreate = prisma.user.create as jest.Mock;
const mockHash = bcrypt.hash as jest.Mock;

const createNextRequest = (body: any) => new (NextRequest as any)(body) as NextRequest;

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

it("registra usuário com sucesso", async () => {
  mockFindUnique.mockResolvedValue(null);
  mockCreate.mockResolvedValue({
    id: "1",
    name: "João",
    email: "joao@test.com",
  });

  const req = createNextRequest({
    name: "João",
    email: "joao@test.com",
    password: "123456",
  });
  const res = await POST(req);

  expect(res.status).toBe(201);
  const body = await res.json();
  expect(body.email).toBe("joao@test.com");
  expect(mockHash).toHaveBeenCalledWith("123456", 12);
});

it("rejeita email duplicado", async () => {
  mockFindUnique.mockResolvedValue({ id: "existing" });

  const req = createNextRequest({
    name: "João",
    email: "joao@test.com",
    password: "123456",
  });
  const res = await POST(req);

  expect(res.status).toBe(400);
  const body = await res.json();
  expect(body.error).toContain("já está cadastrado");
});

it("rejeita dados inválidos", async () => {
  const req = createNextRequest({
    name: "J",
    email: "invalido",
    password: "12",
  });
  const res = await POST(req);

  expect(res.status).toBe(500);
});
