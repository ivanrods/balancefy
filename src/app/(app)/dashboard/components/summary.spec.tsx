import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PeriodProvider } from "@/context/period-context";
import { CurrencyProvider } from "@/context/currency-context";
import { LocaleProvider } from "@/context/locale-context";
import Summary from "@/app/(app)/dashboard/components/summary";

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={qc}>
        <PeriodProvider>
          <CurrencyProvider>
            <LocaleProvider>{children}</LocaleProvider>
          </CurrencyProvider>
        </PeriodProvider>
      </QueryClientProvider>
    );
  }
  return Wrapper;
}

const mockTransaction = {
  id: "1",
  description: "Salário",
  value: 5000,
  type: "income" as const,
  date: new Date("2026-07-10"),
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

afterEach(() => {
  jest.restoreAllMocks();
});

it("exibe skeleton enquanto carrega", () => {
  mockFetch.mockImplementation(() => new Promise(() => {}));

  render(<Summary />, { wrapper: createWrapper() });
  expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
});

it("renderiza 4 cards com valores zerados sem transações", async () => {
  render(<Summary />, { wrapper: createWrapper() });

  await waitFor(() => {
    expect(screen.getAllByText("R$ 0,00")).toHaveLength(4);
  });
});

it("renderiza income de 5000 e expense de 0 com uma transação de receita", async () => {
  mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([mockTransaction]) });

  render(<Summary />, { wrapper: createWrapper() });

  await waitFor(() => {
    expect(screen.getAllByText("R$ 5.000,00")).toHaveLength(3);
    expect(screen.getByText("R$ 0,00")).toBeInTheDocument();
  });
});
