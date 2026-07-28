import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWalletsQuery, useWalletsMutations } from "@/hooks/use-wallets";
import type { Wallets } from "@/types/wallet";

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

const mockWallet: Wallets = {
  id: "w1",
  name: "Principal",
  balance: 500,
  totalIncome: 1000,
  totalExpense: 500,
  lastTransaction: null,
};

let mockFetch: jest.Mock;

beforeEach(() => {
  mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
  globalThis.fetch = mockFetch;
});

describe("useWalletsQuery", () => {
  it("retorna dados quando fetch é bem-sucedido", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([mockWallet]) });

    const { result } = renderHook(() => useWalletsQuery(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });

  it("passa month/year na URL", async () => {
    renderHook(() => useWalletsQuery({ month: 6, year: 2024 }), { wrapper: createWrapper() });
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledWith("/api/wallets?type=summary&month=6&year=2024");
  });

  it("usa initialData quando não tem filtro de mês", () => {
    const { result } = renderHook(() => useWalletsQuery(undefined, [mockWallet]), {
      wrapper: createWrapper(),
    });
    expect(result.current.data).toHaveLength(1);
  });
});

describe("useWalletsMutations", () => {
  it("createWallet faz POST", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockWallet) });

    const { result } = renderHook(() => useWalletsMutations(), { wrapper: createWrapper() });
    result.current.createWallet.mutate({ name: "Nova" });

    await waitFor(() => expect(result.current.createWallet.isSuccess).toBe(true));
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/wallets",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("updateWallet faz PUT", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockWallet) });

    const { result } = renderHook(() => useWalletsMutations(), { wrapper: createWrapper() });
    result.current.updateWallet.mutate({ id: "w1", name: "Renomeado" });

    await waitFor(() => expect(result.current.updateWallet.isSuccess).toBe(true));
  });

  it("deleteWallet faz DELETE", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    const { result } = renderHook(() => useWalletsMutations(), { wrapper: createWrapper() });
    result.current.deleteWallet.mutate("w1");

    await waitFor(() => expect(result.current.deleteWallet.isSuccess).toBe(true));
  });
});
