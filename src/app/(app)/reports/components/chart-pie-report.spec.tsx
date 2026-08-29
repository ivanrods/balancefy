import { render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChartPieReport } from "@/app/(app)/reports/components/chart-pie-report";
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

jest.mock("@/hooks/use-summary-all", () => ({
  useSummaryAll: jest.fn(),
}));

jest.mock("@/hooks/use-summary-month", () => ({
  useSummaryMonth: jest.fn(),
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
  userId: "u1",
  categoryId: "c1",
  category: { id: "c1", name: "Alimentacao", color: "#ff0000", userId: "u1" },
  walletId: "w1",
  wallet: { id: "w1", name: "Principal", userId: "u1" },
};

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

function mockSummaryHooks(
  overrides: {
    incomeAll?: number;
    expenseAll?: number;
    incomeMonth?: number;
    expenseMonth?: number;
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
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUsePeriod();
  mockSummaryHooks();
});

it("exibe skeleton enquanto carrega", () => {
  mockSummaryHooks({ isLoading: true });
  render(<ChartPieReport />, { wrapper: createWrapper() });
  expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
});

it("nao exibe skeleton quando dados carregaram", () => {
  mockSummaryHooks({ isLoading: false });
  render(<ChartPieReport />, { wrapper: createWrapper() });
  expect(document.querySelector('[data-slot="skeleton"]')).not.toBeInTheDocument();
});

it("renderiza container do grafico quando dados carregam", async () => {
  render(<ChartPieReport />, { wrapper: createWrapper() });
  await waitFor(() => {
    expect(document.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});

it("usa dados do mes quando mode='month'", () => {
  mockUsePeriod({ mode: "month" });
  mockSummaryHooks({ incomeMonth: 2000, expenseMonth: 1500 });

  render(<ChartPieReport initialTransactions={[mockTx]} />, {
    wrapper: createWrapper(),
  });

  expect(useSummaryAllModule.useSummaryAll).toHaveBeenCalledWith([mockTx]);
  expect(useSummaryMonthModule.useSummaryMonth).toHaveBeenCalledWith([mockTx]);
});

it("usa dados totais quando mode='total'", () => {
  mockUsePeriod({ mode: "total" });
  mockSummaryHooks({ incomeAll: 5000, expenseAll: 3000 });

  render(<ChartPieReport initialTransactions={[mockTx]} />, {
    wrapper: createWrapper(),
  });

  expect(useSummaryAllModule.useSummaryAll).toHaveBeenCalledWith([mockTx]);
  expect(useSummaryMonthModule.useSummaryMonth).toHaveBeenCalledWith([mockTx]);
});

it("renderiza sem initialTransactions", () => {
  render(<ChartPieReport />, { wrapper: createWrapper() });

  expect(useSummaryAllModule.useSummaryAll).toHaveBeenCalledWith(undefined);
  expect(useSummaryMonthModule.useSummaryMonth).toHaveBeenCalledWith(undefined);
});

it("renderiza com initialTransactions", () => {
  render(<ChartPieReport initialTransactions={[mockTx]} />, {
    wrapper: createWrapper(),
  });

  expect(useSummaryAllModule.useSummaryAll).toHaveBeenCalledWith([mockTx]);
  expect(useSummaryMonthModule.useSummaryMonth).toHaveBeenCalledWith([mockTx]);
});

it("renderiza o container do grafico", () => {
  render(<ChartPieReport />, { wrapper: createWrapper() });
  expect(document.querySelector('[data-slot="chart"]')).toBeInTheDocument();
});

it("chama useSummaryAll e useSummaryMonth", () => {
  render(<ChartPieReport />, { wrapper: createWrapper() });
  expect(useSummaryAllModule.useSummaryAll).toHaveBeenCalledTimes(1);
  expect(useSummaryMonthModule.useSummaryMonth).toHaveBeenCalledTimes(1);
});
