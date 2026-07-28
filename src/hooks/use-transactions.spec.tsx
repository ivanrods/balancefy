import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTransactionsQuery, useTransactionsMutations } from "@/hooks/use-transactions";
import type { Transaction } from "@/types/transaction";

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

const mockTx: Transaction = {
  id: "1",
  description: "Teste",
  value: 100,
  type: "expense",
  date: new Date("2024-06-15"),
  categoryId: "c1",
  category: { id: "c1", name: "Geral", color: "#000", userId: "u1" },
  walletId: "w1",
  wallet: { id: "w1", name: "Principal", userId: "u1" },
};

let mockFetch: jest.Mock;

beforeEach(() => {
  mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
  globalThis.fetch = mockFetch;
});

describe("useTransactionsQuery", () => {
  it("retorna dados quando fetch é bem-sucedido", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([mockTx]) });

    const { result } = renderHook(() => useTransactionsQuery(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });

  it("passa month/year na URL", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

    renderHook(() => useTransactionsQuery({ month: 6, year: 2024 }), { wrapper: createWrapper() });
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledWith("/api/transactions?month=6&year=2024");
  });

  it("usa initialData quando não tem filtro de mês", () => {
    const { result } = renderHook(() => useTransactionsQuery(undefined, [mockTx]), {
      wrapper: createWrapper(),
    });
    expect(result.current.data).toHaveLength(1);
  });
});

describe("useTransactionsMutations", () => {
  it("createTransaction faz POST e invalida queries", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTx) });

    const { result } = renderHook(() => useTransactionsMutations(), { wrapper: createWrapper() });
    result.current.createTransaction.mutate({
      description: "Teste",
      value: 100,
      type: "expense",
      categoryId: "c1",
      walletId: "w1",
      date: new Date("2024-06-15"),
    });

    await waitFor(() => expect(result.current.createTransaction.isSuccess).toBe(true));
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/transactions",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("updateTransaction faz PUT", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTx) });

    const { result } = renderHook(() => useTransactionsMutations(), { wrapper: createWrapper() });
    result.current.updateTransaction.mutate({ ...mockTx, description: "Alterado" });

    await waitFor(() => expect(result.current.updateTransaction.isSuccess).toBe(true));
  });

  it("deleteTransaction faz DELETE", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    const { result } = renderHook(() => useTransactionsMutations(), { wrapper: createWrapper() });
    result.current.deleteTransaction.mutate("1");

    await waitFor(() => expect(result.current.deleteTransaction.isSuccess).toBe(true));
  });
});
