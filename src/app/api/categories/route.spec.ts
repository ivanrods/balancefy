/* eslint-disable @typescript-eslint/no-explicit-any */
if (typeof globalThis.Request === "undefined") {
  globalThis.Request = class Request {
    body: any;
    url: string;
    constructor(input: string | URL, init?: RequestInit) {
      this.url = typeof input === "string" ? input : input.toString();
      this.body = init?.body ? JSON.parse(init.body as string) : {};
    }
    json() {
      return Promise.resolve(this.body);
    }
  } as unknown as typeof globalThis.Request;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

import { GET as LIST_GET, POST } from "@/app/api/categories/route";
import { GET as DETAIL_GET, PUT, DELETE } from "@/app/api/categories/[id]/route";

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
    category: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("@/lib/services/category-service", () => ({
  getCategoriesSummary: jest.fn(),
}));

import { withAuth } from "@/lib/api-handler";
import { prisma } from "@/lib/prisma";
import { getCategoriesSummary } from "@/lib/services/category-service";

const mockWithAuth = jest.mocked(withAuth);
const mockFindMany = prisma.category.findMany as jest.Mock;
const mockFindFirst = prisma.category.findFirst as jest.Mock;
const mockFindUnique = prisma.category.findUnique as jest.Mock;
const mockCreate = prisma.category.create as jest.Mock;
const mockUpdate = prisma.category.update as jest.Mock;
const mockDelete = prisma.category.delete as jest.Mock;
const mockSummary = jest.mocked(getCategoriesSummary);

beforeEach(() => jest.clearAllMocks());

const ctx = { params: Promise.resolve({ id: "cat-1" }) };

describe("GET /api/categories", () => {
  it("retorna categorias (select)", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockFindMany.mockResolvedValue([{ id: "c1", name: "Alimentação", color: "#f00" }]);
    const res = await LIST_GET(new Request("http://localhost/api/categories"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
  });

  it("retorna summary com filtro", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockSummary.mockResolvedValue([
      {
        id: "c1",
        name: "Alimentação",
        color: "#f00",
        value: 200,
        number: 2,
        relationship: ["Mercado"],
      },
    ]);
    const res = await LIST_GET(
      new Request("http://localhost/api/categories?type=summary&month=6&year=2024"),
    );
    expect(res.status).toBe(200);
    expect(mockSummary).toHaveBeenCalledWith({ userId: "u1", month: 6, year: 2024 });
  });
});

describe("POST /api/categories", () => {
  it("cria categoria e retorna 201", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockFindFirst.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: "c1", name: "Lazer", color: "#0f0" });
    const res = await POST(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ name: "Lazer", color: "#0f0" }),
      }),
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.name).toBe("Lazer");
  });

  it("retorna 400 se nome já existe", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockFindFirst.mockResolvedValue({ id: "existing" });
    const res = await POST(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ name: "Lazer", color: "#0f0" }),
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("já tem uma categoria");
  });
});

describe("GET /api/categories/[id]", () => {
  it("retorna 404 se não existe", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockFindUnique.mockResolvedValue(null);
    const res = await DETAIL_GET(new Request("http://localhost"), ctx);
    expect(res.status).toBe(404);
  });

  it("retorna categoria por id", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockFindUnique.mockResolvedValue({ id: "cat-1", name: "Teste", color: "#000" });
    const res = await DETAIL_GET(new Request("http://localhost"), ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("Teste");
  });
});

describe("PUT /api/categories/[id]", () => {
  it("atualiza categoria", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockUpdate.mockResolvedValue({ id: "cat-1", name: "Renomeado", color: "#fff" });
    const res = await PUT(
      new Request("http://localhost", {
        method: "PUT",
        body: JSON.stringify({ name: "Renomeado", color: "#fff" }),
      }),
      ctx,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("Renomeado");
  });
});

describe("DELETE /api/categories/[id]", () => {
  it("deleta categoria", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockDelete.mockResolvedValue({});
    const res = await DELETE(new Request("http://localhost"), ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toContain("removida");
  });
});
