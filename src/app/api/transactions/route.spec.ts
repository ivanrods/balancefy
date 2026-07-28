if (typeof globalThis.Request === "undefined") {
  globalThis.Request = class Request {
    body: unknown;
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

import type { Transaction, TransactionType } from "@/types/transaction";
import { GET as LIST_GET, POST } from "@/app/api/transactions/route";
import { GET as DETAIL_GET, PUT, DELETE } from "@/app/api/transactions/[id]/route";
import { GET as CHART_GET } from "@/app/api/transactions/transaction-type/route";

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

jest.mock("@/lib/services/transaction-service", () => ({
  getTransactions: jest.fn(),
  createTransaction: jest.fn(),
  updateTransaction: jest.fn(),
  deleteTransaction: jest.fn(),
  getTransactionChart: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: { transaction: { findUnique: jest.fn() } },
}));

import { withAuth } from "@/lib/api-handler";
import * as txService from "@/lib/services/transaction-service";
import { prisma } from "@/lib/prisma";

const mockWithAuth = jest.mocked(withAuth);
const mockTxFindUnique = prisma.transaction.findUnique as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const ctx = { params: Promise.resolve({ id: "tx-1" }) };

describe("GET /api/transactions", () => {
  it("retorna lista de transações", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    jest
      .mocked(txService.getTransactions)
      .mockResolvedValue([{ id: "t1", description: "Teste" } as unknown as Transaction]);
    const res = await LIST_GET(new Request("http://localhost/api/transactions"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
  });

  it("passa month/year como filtro", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    await LIST_GET(new Request("http://localhost/api/transactions?month=6&year=2024"));
    expect(txService.getTransactions).toHaveBeenCalledWith("u1", { month: 6, year: 2024 });
  });
});

describe("POST /api/transactions", () => {
  it("cria transação e retorna 201", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    jest
      .mocked(txService.createTransaction)
      .mockResolvedValue({ id: "t1", description: "Compra" } as unknown as Transaction);
    const res = await POST(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({
          description: "Compra",
          value: 100,
          categoryId: "c1",
          walletId: "w1",
          type: "expense",
          date: "2024-06-15",
        }),
      }),
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.description).toBe("Compra");
  });
});

describe("GET /api/transactions/[id]", () => {
  it("retorna 404 se não existe", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockTxFindUnique.mockResolvedValue(null);
    const res = await DETAIL_GET(new Request("http://localhost"), ctx);
    expect(res.status).toBe(404);
  });

  it("retorna transação por id", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    mockTxFindUnique.mockResolvedValue({ id: "tx-1", description: "Teste" });
    const res = await DETAIL_GET(new Request("http://localhost"), ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.description).toBe("Teste");
  });
});

describe("PUT /api/transactions/[id]", () => {
  it("atualiza transação", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    jest
      .mocked(txService.updateTransaction)
      .mockResolvedValue({ id: "tx-1", description: "Alterado" } as unknown as Transaction);
    const res = await PUT(
      new Request("http://localhost", {
        method: "PUT",
        body: JSON.stringify({
          description: "Alterado",
          value: 99,
          categoryId: "c1",
          walletId: "w1",
          type: "expense",
          date: "2024-06-15",
        }),
      }),
      ctx,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.description).toBe("Alterado");
  });
});

describe("DELETE /api/transactions/[id]", () => {
  it("deleta transação", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    jest.mocked(txService.deleteTransaction).mockResolvedValue();
    const res = await DELETE(new Request("http://localhost"), ctx);
    expect(res.status).toBe(200);
  });
});

describe("GET /api/transactions/transaction-type", () => {
  it("retorna dados do gráfico", async () => {
    mockWithAuth.mockResolvedValue({ id: "u1", email: "a@b.com" });
    jest
      .mocked(txService.getTransactionChart)
      .mockResolvedValue([
        { month: "janeiro", income: 100, expense: 50 },
      ] as unknown as TransactionType[]);
    const res = await CHART_GET(
      new Request("http://localhost/api/transactions/transaction-type?period=month&year=2024"),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body[0].income).toBe(100);
  });
});
