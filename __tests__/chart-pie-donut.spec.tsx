import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChartPieDonut } from "@/app/(app)/dashboard/components/chart-pie-donut";

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

jest.mock("@/context/period-context", () => ({
  PeriodProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  usePeriod: jest.fn(() => ({
    mode: "month" as const,
    setMode: jest.fn(),
    selectedMonth: 7,
    setSelectedMonth: jest.fn(),
  })),
}));

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

const mockTx = {
  id: "1",
  description: "Mercado",
  value: 200,
  type: "expense" as const,
  date: new Date("2026-07-10"),
  categoryId: "c1",
  category: { id: "c1", name: "Alimentação", color: "#ff0000", userId: "u1" },
  walletId: "w1",
  wallet: { id: "w1", name: "Principal", userId: "u1" },
};

let mockFetch: jest.Mock;

beforeEach(() => {
  mockFetch = jest
    .fn()
    .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
  globalThis.fetch = mockFetch;
});

it("exibe skeleton enquanto carrega", () => {
  mockFetch.mockImplementation(() => new Promise(() => {}));

  render(<ChartPieDonut />, { wrapper: createWrapper() });
  expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
});

it("exibe título e descrição", async () => {
  render(<ChartPieDonut />, { wrapper: createWrapper() });

  await waitFor(() => {
    expect(screen.getByText("Distribuição de Gastos")).toBeInTheDocument();
    expect(screen.getByText("julho")).toBeInTheDocument();
  });
});

it("renderiza gráfico com transações agrupadas por categoria", async () => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([mockTx]),
  });

  render(<ChartPieDonut />, { wrapper: createWrapper() });

  await waitFor(() => {
    expect(
      screen.getByText("Baseado nas transações do mês de julho"),
    ).toBeInTheDocument();
  });
});
