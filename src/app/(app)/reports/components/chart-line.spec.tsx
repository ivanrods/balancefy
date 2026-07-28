import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChartLine } from "@/app/(app)/reports/components/chart-line";
import * as periodContext from "@/context/period-context";
import * as useTransactionsTypeModule from "@/hooks/use-transactions-type";

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
        "reports.charts.spendingDistribution": "Evolucao do saldo",
        "reports.charts.balanceEvolution": "Saldo do periodo:",
        "reports.charts.wholePeriod": "todo o periodo",
      };
      return translations[key] ?? key;
    },
    locale: "pt-BR" as const,
    setLocale: jest.fn(),
  })),
}));

jest.mock("@/context/period-context", () => ({
  PeriodProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  usePeriod: jest.fn(() => ({
    mode: "month" as const,
    setMode: jest.fn(),
    selectedMonth: 7,
    setSelectedMonth: jest.fn(),
  })),
}));

jest.mock("@/hooks/use-transactions-type", () => ({
  useTransactionsType: jest.fn(),
}));

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

const mockTransactionsType = [
  { week: "Semana 1", income: 1000, expense: 500 },
  { week: "Semana 2", income: 1500, expense: 800 },
  { week: "Semana 3", income: 2000, expense: 1200 },
];

function mockUsePeriod(overrides: Partial<ReturnType<typeof periodContext.usePeriod>> = {}) {
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

function mockUseTransactionsType(
  overrides: {
    transactionsType?: typeof mockTransactionsType;
    isLoading?: boolean;
  } = {},
) {
  (useTransactionsTypeModule.useTransactionsType as jest.Mock).mockReturnValue({
    transactionsType: overrides.transactionsType ?? mockTransactionsType,
    isLoading: overrides.isLoading ?? false,
    error: null,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUsePeriod();
  mockUseTransactionsType();
});

it("exibe skeleton enquanto carrega", () => {
  mockUseTransactionsType({ isLoading: true });
  render(<ChartLine />, { wrapper: createWrapper() });
  expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
});

it("nao exibe skeleton quando dados carregaram", () => {
  mockUseTransactionsType({ isLoading: false });
  render(<ChartLine />, { wrapper: createWrapper() });
  expect(document.querySelector('[data-slot="skeleton"]')).not.toBeInTheDocument();
});

it("renderiza titulo e descricao", () => {
  mockUseTransactionsType({ isLoading: false });
  render(<ChartLine />, { wrapper: createWrapper() });

  expect(screen.getByText("Evolucao do saldo")).toBeInTheDocument();
  expect(screen.getByText("Saldo do periodo:")).toBeInTheDocument();
});

it("renderiza container do grafico quando dados carregam", () => {
  mockUseTransactionsType({ isLoading: false });
  render(<ChartLine />, { wrapper: createWrapper() });
  expect(document.querySelector('[data-slot="chart"]')).toBeInTheDocument();
});

it("usa periodo 'week' e selectedMonth quando mode='month'", () => {
  mockUsePeriod({ mode: "month", selectedMonth: 5 });
  mockUseTransactionsType({ isLoading: false });

  render(<ChartLine initialChartData={mockTransactionsType} />, {
    wrapper: createWrapper(),
  });

  expect(useTransactionsTypeModule.useTransactionsType).toHaveBeenCalledWith(
    expect.objectContaining({ period: "week", month: 5 }),
    mockTransactionsType,
  );
});

it("usa periodo 'month' e sem month quando mode='total'", () => {
  mockUsePeriod({ mode: "total" });
  mockUseTransactionsType({ isLoading: false });

  render(<ChartLine initialChartData={mockTransactionsType} />, {
    wrapper: createWrapper(),
  });

  expect(useTransactionsTypeModule.useTransactionsType).toHaveBeenCalledWith(
    expect.objectContaining({ period: "month", month: undefined }),
    mockTransactionsType,
  );
});

it("renderiza sem initialChartData", () => {
  render(<ChartLine />, { wrapper: createWrapper() });
  expect(useTransactionsTypeModule.useTransactionsType).toHaveBeenCalledTimes(1);
});

it("renderiza com initialChartData", () => {
  render(<ChartLine initialChartData={mockTransactionsType} />, {
    wrapper: createWrapper(),
  });
  expect(useTransactionsTypeModule.useTransactionsType).toHaveBeenCalledWith(
    expect.anything(),
    mockTransactionsType,
  );
});

it("chama useTransactionsType uma vez", () => {
  render(<ChartLine />, { wrapper: createWrapper() });
  expect(useTransactionsTypeModule.useTransactionsType).toHaveBeenCalledTimes(1);
});

it("exibe label do mes no modo month", () => {
  mockUsePeriod({ mode: "month", selectedMonth: 3 });
  mockUseTransactionsType({ isLoading: false });

  render(<ChartLine />, { wrapper: createWrapper() });

  expect(screen.getByText(/Baseado nas transações do mês de/)).toBeInTheDocument();
});

it("exibe label de periodo total no modo total", () => {
  mockUsePeriod({ mode: "total" });
  mockUseTransactionsType({ isLoading: false });

  render(<ChartLine />, { wrapper: createWrapper() });

  expect(screen.getByText(/Baseado nas transações de todo o período/)).toBeInTheDocument();
});

it("renderiza footer com instrucao", () => {
  render(<ChartLine />, { wrapper: createWrapper() });
  expect(screen.getByText("Passe o mouse sobre o gráfico para ver detalhes")).toBeInTheDocument();
});
