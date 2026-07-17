/* eslint-disable @typescript-eslint/no-explicit-any */
if (typeof globalThis.Request === "undefined") {
  globalThis.Request = class Request {
    body: any;
    url: string;
    constructor(input: string | URL, init?: RequestInit) {
      this.url = typeof input === "string" ? input : input.toString();
      this.body = init?.body ? JSON.parse(init.body as string) : {};
    }
    json() { return Promise.resolve(this.body); }
  } as unknown as typeof globalThis.Request;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

import { GET as LIST_GET, POST } from "@/app/api/wallets/route";
import { GET as DETAIL_GET, PUT, DELETE } from "@/app/api/wallets/[id]/route";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      json: () => Promise.resolve(body),
    })),
  },
}));

jest.mock("@/lib/api-handler", () => ({
  withAuth: jest.fn(),
  apiError: jest.fn((e) => ({
    status: e instanceof Error ? 400 : 500,
    json: () => Promise.resolve({ error: e instanceof Error ? e.message : "Internal" }),
  })),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    wallet: { findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  },
}));

jest.mock("@/lib/services/wallet-service", () => ({
  getWalletsSummary: jest.fn(),
}));

import { withAuth } from "@/lib/api-handler";
import { prisma } from "@/lib/prisma";
import { getWalletsSummary } from "@/lib/services/wallet-service";

const mockWithAuth = jest.mocked(withAuth);
const mockFindMany = prisma.wallet.findMany as jest.Mock;
const mockFindFirst = prisma.wallet.findFirst as jest.Mock;
const mockFindUnique = prisma.wallet.findUnique as jest.Mock;
const mockCreate = prisma.wallet.create as jest.Mock;
const mockUpdate = prisma.wallet.update as jest.Mock;
const mockDelete = prisma.wallet.delete as jest.Mock;
const mockSummary = jest.mocked(getWalletsSummary);

beforeEach(() => jest.clearAllMocks());

const ctx = { params: Promise.resolve({ id: "wallet-1" }) };

describe("GET /api/wallets", () => {
  it("retorna carteiras (select)", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockFindMany.mockResolvedValue([{ id: "w1", name: "Principal" }]);
    const res = await LIST_GET(new Request("http://localhost/api/wallets"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
  });

  it("retorna summary com filtro", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockSummary.mockResolvedValue([{ id: "w1", name: "Principal", totalIncome: 1000, totalExpense: 500, balance: 500, lastTransaction: null }]);
    const res = await LIST_GET(new Request("http://localhost/api/wallets?type=summary&month=6&year=2024"));
    expect(res.status).toBe(200);
    expect(mockSummary).toHaveBeenCalledWith({ userId: "u1", month: 6, year: 2024 });
  });
});

describe("POST /api/wallets", () => {
  it("cria carteira e retorna 201", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockFindFirst.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: "w1", name: "Nova" });
    const res = await POST(new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ name: "Nova" }),
    }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.name).toBe("Nova");
  });

  it("retorna 400 se nome já existe", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockFindFirst.mockResolvedValue({ id: "existing" });
    const res = await POST(new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ name: "Nova" }),
    }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("já tem uma carteira");
  });
});

describe("GET /api/wallets/[id]", () => {
  it("retorna 404 se não existe", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockFindUnique.mockResolvedValue(null);
    const res = await DETAIL_GET(new Request("http://localhost"), ctx);
    expect(res.status).toBe(404);
  });

  it("retorna carteira por id", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockFindUnique.mockResolvedValue({ id: "wallet-1", name: "Principal" });
    const res = await DETAIL_GET(new Request("http://localhost"), ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("Principal");
  });
});

describe("PUT /api/wallets/[id]", () => {
  it("atualiza carteira", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockUpdate.mockResolvedValue({ id: "wallet-1", name: "Renomeado" });
    const res = await PUT(new Request("http://localhost", {
      method: "PUT",
      body: JSON.stringify({ name: "Renomeado" }),
    }), ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("Renomeado");
  });
});

describe("DELETE /api/wallets/[id]", () => {
  it("deleta carteira", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockDelete.mockResolvedValue({});
    const res = await DELETE(new Request("http://localhost"), ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toContain("removida");
  });
});
