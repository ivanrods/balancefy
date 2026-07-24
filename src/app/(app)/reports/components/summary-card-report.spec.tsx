import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SummaryCardReport from "@/app/(app)/reports/components/summary-card-report";
import * as periodContext from "@/context/period-context";
import * as useSummaryAllModule from "@/hooks/use-summary-all";
import * as useSummaryMonthModule from "@/hooks/use-summary-month";

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

jest.mock("@/hooks/use-translation", () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "reports.summaryIncome": "Entradas",
        "reports.summaryExpenses": "Saidas",
        "reports.summaryCard.spendingDistribution": "Distribuicao de Gastos",
        "reports.summaryCard.balanceEvolutionBefore": "Analise do saldo",
        "reports.summaryCard.balanceEvolutionAfter": "ate o momento",
        "reports.summaryCard.categoryDistributionBefore":
          "Veja como seus gastos se distribuem por",
        "reports.summaryCard.categoryDistributionHighlight": "categorias",
        "reports.summaryCard.categoryDistributionMiddle": "no periodo de",
        "reports.summaryCard.categoryDistributionAfter": "",
        "reports.summaryCard.comparisonBefore": "Compare seus",
        "reports.summaryCard.comparisonHighlight": "resultados",
        "reports.summaryCard.comparisonMiddle": "entre os meses de",
        "reports.summaryCard.comparisonAfter": "",
        "reports.summaryCard.wholePeriod": "todo o periodo",
      };
      return translations[key] ?? key;
    },
    locale: "pt-BR" as const,
    setLocale: jest.fn(),
  })),
}));

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

jest.mock("@/context/currency-context", () => ({
  CurrencyProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useCurrency: jest.fn(() => ({
    currency: "BRL",
    setCurrency: jest.fn(),
  })),
}));

jest.mock("@/hooks/use-summary-all", () => ({
  useSummaryAll: jest.fn(),
}));

jest.mock("@/hooks/use-summary-month", () => ({
  useSummaryMonth: jest.fn(),
}));

jest.mock("./chart-pie-report", () => ({
  ChartPieReport: ({
    initialTransactions,
  }: {
    initialTransactions?: unknown;
  }) => (
    <div
      data-testid="chart-pie-report"
      data-has-transactions={
        initialTransactions !== undefined ? "true" : "false"
      }
    />
  ),
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
  category: { id: "c1", name: "Alimentacao", color: "#ff0000", userId: "u1" },
  walletId: "w1",
  wallet: { id: "w1", name: "Principal", userId: "u1" },
};

function mockUsePeriod(
  overrides: Partial<ReturnType<typeof periodContext.usePeriod>> = {},
) {
  const defaultMock = {
    mode: "month" as const,
    setMode: jest.fn(),
    selectedMonth: 7,
    setSelectedMonth: jest.fn(),
  };
  (periodContext.usePeriod as jest.Mock).mockReturnValue({
    ...defaultMock,
    ...overrides,
  });
}

function mockSummaryHooks(
  overrides: {
    incomeAll?: number;
    expenseAll?: number;
    incomeMonth?: number;
    expenseMonth?: number;
    dateToday?: string;
    isLoading?: boolean;
  } = {},
) {
  (useSummaryAllModule.useSummaryAll as jest.Mock).mockReturnValue({
    incomeAll: overrides.incomeAll ?? 5000,
    expenseAll: overrides.expenseAll ?? 3000,
    isLoading: overrides.isLoading ?? false,
  });
  (useSummaryMonthModule.useSummaryMonth as jest.Mock).mockReturnValue({
    incomeMonth: overrides.incomeMonth ?? 2000,
    expenseMonth: overrides.expenseMonth ?? 1500,
    dateToday: overrides.dateToday ?? "julho",
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUsePeriod();
  mockSummaryHooks();
});

it("exibe skeleton enquanto carrega", () => {
  mockSummaryHooks({ isLoading: true });
  render(<SummaryCardReport />, { wrapper: createWrapper() });
  expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
});

it("nao exibe skeleton quando dados carregaram", () => {
  mockSummaryHooks({ isLoading: false });
  render(<SummaryCardReport />, { wrapper: createWrapper() });
  expect(
    document.querySelector('[data-slot="skeleton"]'),
  ).not.toBeInTheDocument();
});

it("renderiza titulo Distribuicao de Gastos", () => {
  render(<SummaryCardReport />, { wrapper: createWrapper() });
  expect(screen.getByText("Distribuicao de Gastos")).toBeInTheDocument();
});

it("renderiza income formatado no modo month", () => {
  mockUsePeriod({ mode: "month" });
  mockSummaryHooks({ incomeMonth: 2000 });

  render(<SummaryCardReport />, { wrapper: createWrapper() });

  expect(screen.getByText("Entradas")).toBeInTheDocument();
  expect(screen.getByText(/2.000,00/)).toBeInTheDocument();
});

it("renderiza expense formatado no modo month", () => {
  mockUsePeriod({ mode: "month" });
  mockSummaryHooks({ expenseMonth: 1500 });

  render(<SummaryCardReport />, { wrapper: createWrapper() });

  expect(screen.getByText("Saidas")).toBeInTheDocument();
  expect(screen.getByText(/1.500,00/)).toBeInTheDocument();
});

it("renderiza income formatado no modo total", () => {
  mockUsePeriod({ mode: "total" });
  mockSummaryHooks({ incomeAll: 5000 });

  render(<SummaryCardReport />, { wrapper: createWrapper() });

  expect(screen.getByText("Entradas")).toBeInTheDocument();
  expect(screen.getByText(/5.000,00/)).toBeInTheDocument();
});

it("renderiza expense formatado no modo total", () => {
  mockUsePeriod({ mode: "total" });
  mockSummaryHooks({ expenseAll: 3000 });

  render(<SummaryCardReport />, { wrapper: createWrapper() });

  expect(screen.getByText("Saidas")).toBeInTheDocument();
  expect(screen.getByText(/3.000,00/)).toBeInTheDocument();
});

it("exibe nome do mes no modo month", () => {
  mockUsePeriod({ mode: "month" });
  mockSummaryHooks({ dateToday: "julho" });

  render(<SummaryCardReport />, { wrapper: createWrapper() });

  expect(screen.getByText("julho")).toBeInTheDocument();
});

it("exibe 'todo o periodo' no modo total", () => {
  mockUsePeriod({ mode: "total" });

  render(<SummaryCardReport />, { wrapper: createWrapper() });

  expect(screen.getByText("todo o periodo")).toBeInTheDocument();
});

it("renderiza ChartPieReport com initialTransactions", () => {
  render(<SummaryCardReport initialTransactions={[mockTx]} />, {
    wrapper: createWrapper(),
  });

  expect(screen.getByTestId("chart-pie-report")).toHaveAttribute(
    "data-has-transactions",
    "true",
  );
});

it("renderiza ChartPieReport sem initialTransactions", () => {
  render(<SummaryCardReport />, { wrapper: createWrapper() });

  expect(screen.getByTestId("chart-pie-report")).toHaveAttribute(
    "data-has-transactions",
    "false",
  );
});

it("chama useSummaryAll e useSummaryMonth", () => {
  render(<SummaryCardReport />, { wrapper: createWrapper() });

  expect(useSummaryAllModule.useSummaryAll).toHaveBeenCalledTimes(1);
  expect(useSummaryMonthModule.useSummaryMonth).toHaveBeenCalledTimes(1);
});

it("passa initialTransactions para os hooks", () => {
  render(<SummaryCardReport initialTransactions={[mockTx]} />, {
    wrapper: createWrapper(),
  });

  expect(useSummaryAllModule.useSummaryAll).toHaveBeenCalledWith([mockTx]);
  expect(useSummaryMonthModule.useSummaryMonth).toHaveBeenCalledWith([mockTx]);
});
