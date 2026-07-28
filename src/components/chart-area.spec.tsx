import { render, screen } from "@testing-library/react";
import { ChartArea } from "@/components/chart-area";
import * as periodContext from "@/context/period-context";
import * as currencyContext from "@/context/currency-context";
import * as transactionsHook from "@/hooks/use-transactions";

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

jest.mock("@/context/period-context", () => ({
  PeriodProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  usePeriod: jest.fn(),
}));

jest.mock("@/context/currency-context", () => ({
  CurrencyProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useCurrency: jest.fn(),
}));

jest.mock("@/hooks/use-transactions", () => ({
  useTransactions: jest.fn(),
}));

function mockDefault() {
  (periodContext.usePeriod as jest.Mock).mockReturnValue({
    mode: "month" as const,
    setMode: jest.fn(),
    selectedMonth: 7,
    setSelectedMonth: jest.fn(),
  });
  (currencyContext.useCurrency as jest.Mock).mockReturnValue({
    currency: "BRL" as const,
    setCurrency: jest.fn(),
  });
  (transactionsHook.useTransactions as jest.Mock).mockReturnValue({
    transactions: [],
    isLoading: false,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockDefault();
});

describe("ChartArea", () => {
  it("exibe skeleton enquanto carrega", () => {
    (transactionsHook.useTransactions as jest.Mock).mockReturnValue({
      transactions: [],
      isLoading: true,
    });

    render(<ChartArea />);
    expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
  });

  it("exibe título, descrição e footer", () => {
    render(<ChartArea />);

    expect(screen.getByText("Evolução do Saldo")).toBeInTheDocument();
    expect(screen.getByText(new Date().getFullYear().toString())).toBeInTheDocument();
    expect(screen.getByText("Passe o mouse sobre o gráfico para ver detalhes")).toBeInTheDocument();
  });

  it("exibe 'Baseado nas transações do mês de julho' quando mode='month' e selectedMonth=7", () => {
    render(<ChartArea />);

    expect(screen.getByText("Baseado nas transações do mês de julho")).toBeInTheDocument();
  });

  it("exibe 'Baseado nas transações de todo o período' quando mode='total'", () => {
    (periodContext.usePeriod as jest.Mock).mockReturnValue({
      mode: "total" as const,
      setMode: jest.fn(),
      selectedMonth: 7,
      setSelectedMonth: jest.fn(),
    });

    render(<ChartArea />);

    expect(screen.getByText("Baseado nas transações de todo o período")).toBeInTheDocument();
  });

  it("renderiza o container do gráfico com transações", () => {
    const mockTx = {
      id: "1",
      description: "Salário",
      value: 6000,
      date: new Date(),
      type: "income" as const,
      categoryId: "c1",
      category: { id: "c1", name: "Trabalho", color: "#00ff00", userId: "u1" },
      walletId: "w1",
      wallet: { id: "w1", name: "Principal", userId: "u1" },
    };
    (transactionsHook.useTransactions as jest.Mock).mockReturnValue({
      transactions: [mockTx],
      isLoading: false,
    });

    render(<ChartArea />);

    expect(document.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    expect(screen.getByText("Evolução do Saldo")).toBeInTheDocument();
  });

  it("usa initialTransactions quando fornecido", () => {
    const mockTx = {
      id: "2",
      description: "Freela",
      value: 3000,
      date: new Date(),
      type: "income" as const,
      categoryId: "c1",
      category: { id: "c1", name: "Freela", color: "#0000ff", userId: "u1" },
      walletId: "w1",
      wallet: { id: "w1", name: "Principal", userId: "u1" },
    };

    render(<ChartArea initialTransactions={[mockTx]} />);

    expect(document.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="skeleton"]')).not.toBeInTheDocument();
  });
});
