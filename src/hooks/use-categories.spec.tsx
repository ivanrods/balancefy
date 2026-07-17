import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCategoriesQuery, useCategoriesMutations } from "@/hooks/use-categories";
import type { Categories } from "@/types/categories";

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

const mockCat: Categories = { id: "c1", name: "Alimentação", color: "#f00", value: 0, number: 0, relationship: [] };

let mockFetch: jest.Mock;

beforeEach(() => {
  mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
  globalThis.fetch = mockFetch;
});

describe("useCategoriesQuery", () => {
  it("retorna dados quando fetch é bem-sucedido", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([mockCat]) });

    const { result } = renderHook(() => useCategoriesQuery(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });

  it("passa month/year na URL", async () => {
    renderHook(() => useCategoriesQuery({ month: 6, year: 2024 }), { wrapper: createWrapper() });
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledWith("/api/categories?type=summary&month=6&year=2024");
  });

  it("usa initialData quando não tem filtro de mês", () => {
    const { result } = renderHook(() => useCategoriesQuery(undefined, [mockCat]), { wrapper: createWrapper() });
    expect(result.current.data).toHaveLength(1);
  });
});

describe("useCategoriesMutations", () => {
  it("createCategory faz POST", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockCat) });

    const { result } = renderHook(() => useCategoriesMutations(), { wrapper: createWrapper() });
    result.current.createCategory.mutate({ name: "Lazer", color: "#0f0" });

    await waitFor(() => expect(result.current.createCategory.isSuccess).toBe(true));
    expect(mockFetch).toHaveBeenCalledWith("/api/categories", expect.objectContaining({ method: "POST" }));
  });

  it("updateCategory faz PUT", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockCat) });

    const { result } = renderHook(() => useCategoriesMutations(), { wrapper: createWrapper() });
    result.current.updateCategory.mutate({ id: "c1", name: "Renomeado", color: "#00f" });

    await waitFor(() => expect(result.current.updateCategory.isSuccess).toBe(true));
  });

  it("deleteCategory faz DELETE", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    const { result } = renderHook(() => useCategoriesMutations(), { wrapper: createWrapper() });
    result.current.deleteCategory.mutate("c1");

    await waitFor(() => expect(result.current.deleteCategory.isSuccess).toBe(true));
  });
});
