import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { GET, PUT, DELETE } from "@/app/api/profile/route";

/* eslint-disable @typescript-eslint/no-explicit-any */
if (typeof globalThis.Request === "undefined") {
  globalThis.Request = class Request {
    body: any;
    constructor(_url: string, init?: RequestInit) {
      this.body = init?.body ? JSON.parse(init.body as string) : {};
    }
    json() {
      return Promise.resolve(this.body);
    }
  } as unknown as typeof globalThis.Request;
}
if (typeof globalThis.Response === "undefined") {
  globalThis.Response = class Response {
    private data: any;
    status: number;
    constructor(body: string, init?: ResponseInit) {
      this.data = JSON.parse(body);
      this.status = init?.status ?? 200;
    }
    json() {
      return Promise.resolve(this.data);
    }
  } as unknown as typeof globalThis.Response;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      json: () => Promise.resolve(body),
    })),
  },
}));

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    account: { findFirst: jest.fn() },
  },
}));

jest.mock("bcryptjs", () => ({ hash: jest.fn((pwd) => `hashed-${pwd}`) }));

import { getServerSession } from "next-auth/next";

const mockSession = jest.mocked(getServerSession);
const mockFindUnique = prisma.user.findUnique as jest.Mock;
const mockAccountFirst = prisma.account.findFirst as jest.Mock;
const mockUpdate = prisma.user.update as jest.Mock;
const mockDelete = prisma.user.delete as jest.Mock;
const mockHash = bcrypt.hash as jest.Mock;

beforeEach(() => jest.clearAllMocks());

describe("GET", () => {
  it("retorna 401 sem sessão", async () => {
    mockSession.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("retorna 404 quando usuário não existe", async () => {
    mockSession.mockResolvedValue({ user: { email: "x@y.com" } });
    mockFindUnique.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(404);
  });

  it("retorna perfil com provider", async () => {
    mockSession.mockResolvedValue({ user: { email: "a@b.com" } });
    mockFindUnique.mockResolvedValue({ id: "1", name: "João", email: "a@b.com", image: null });
    mockAccountFirst.mockResolvedValue({ provider: "google" });
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.email).toBe("a@b.com");
    expect(body.provider).toBe("google");
  });
});

describe("PUT", () => {
  it("retorna 401 sem sessão", async () => {
    mockSession.mockResolvedValue(null);
    const res = await PUT({ json: () => Promise.resolve({}) } as unknown as Request);
    expect(res.status).toBe(401);
  });

  it("retorna 403 para usuário Google", async () => {
    mockSession.mockResolvedValue({ user: { email: "a@b.com" } });
    mockAccountFirst.mockResolvedValue({ provider: "google" });
    const res = await PUT({ json: () => Promise.resolve({ name: "João" }) } as unknown as Request);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain("Google");
  });

  it("atualiza nome e email", async () => {
    mockSession.mockResolvedValue({ user: { email: "a@b.com" } });
    mockAccountFirst.mockResolvedValue(null);
    mockUpdate.mockResolvedValue({ id: "1", name: "Novo", email: "a@b.com", image: null });
    const res = await PUT({
      json: () => Promise.resolve({ name: "Novo", email: "a@b.com" }),
    } as unknown as Request);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("Novo");
  });

  it("atualiza senha quando fornecida", async () => {
    mockSession.mockResolvedValue({ user: { email: "a@b.com" } });
    mockAccountFirst.mockResolvedValue(null);
    mockUpdate.mockResolvedValue({ id: "1", name: "João", email: "a@b.com", image: null });
    await PUT({
      json: () => Promise.resolve({ name: "João", email: "a@b.com", password: "nova123" }),
    } as unknown as Request);
    expect(mockHash).toHaveBeenCalledWith("nova123", 10);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ password: "hashed-nova123" }) }),
    );
  });
});

describe("DELETE", () => {
  it("retorna 401 sem sessão", async () => {
    mockSession.mockResolvedValue(null);
    const res = await DELETE();
    expect(res.status).toBe(401);
  });

  it("deleta conta com sucesso", async () => {
    mockSession.mockResolvedValue({ user: { email: "a@b.com" } });
    mockDelete.mockResolvedValue({});
    const res = await DELETE();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toContain("excluída");
  });
});
