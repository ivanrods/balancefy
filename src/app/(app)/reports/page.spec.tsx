import { render, screen } from "@testing-library/react";
import ReportsPage, { generateMetadata } from "./page";

const mockGetServerTranslations = jest.fn();
const mockGetServerSession = jest.fn();
const mockGetTransactions = jest.fn();
const mockGetTransactionChart = jest.fn();

jest.mock("@/lib/locale", () => ({
  getServerTranslations: () => mockGetServerTranslations(),
}));

jest.mock("next-auth", () => ({
  getServerSession: () => mockGetServerSession(),
}));

jest.mock("@/lib/auth-options", () => ({
  authOptions: {},
}));

jest.mock("@/lib/services/transaction-service", () => ({
  getTransactions: (...args: unknown[]) => mockGetTransactions(...args),
  getTransactionChart: (...args: unknown[]) => mockGetTransactionChart(...args),
}));

jest.mock("@/components/period-filter-header", () => ({
  __esModule: true,
  PeriodFilterHeader: ({ title }: { title: string }) => (
    <div data-testid="period-filter-header">{title}</div>
  ),
}));

jest.mock("./components/summary-card-report", () => ({
  __esModule: true,
  default: ({ initialTransactions }: { initialTransactions: unknown }) => (
    <div data-testid="summary-card-report" data-has-transactions={initialTransactions !== undefined ? "true" : "false"} />
  ),
}));

jest.mock("./components/transactions-export", () => ({
  TransactionsExport: ({ initialTransactions }: { initialTransactions: unknown }) => (
    <div data-testid="transactions-export" data-has-transactions={initialTransactions !== undefined ? "true" : "false"} />
  ),
}));

jest.mock("@/components/transactions-table", () => ({
  __esModule: true,
  TransactionsTable: ({ initialTransactions }: { initialTransactions: unknown }) => (
    <div data-testid="transactions-table" data-has-transactions={initialTransactions !== undefined ? "true" : "false"} />
  ),
}));

jest.mock("@/components/chart-area", () => ({
  __esModule: true,
  ChartArea: ({ initialTransactions }: { initialTransactions: unknown }) => (
    <div data-testid="chart-area" data-has-transactions={initialTransactions !== undefined ? "true" : "false"} />
  ),
}));

jest.mock("./components/chart-line", () => ({
  __esModule: true,
  ChartLine: ({ initialChartData }: { initialChartData: unknown }) => (
    <div data-testid="chart-line" data-has-chart-data={initialChartData !== undefined ? "true" : "false"} />
  ),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockGetServerTranslations.mockResolvedValue((key: string) => {
    const map: Record<string, string> = {
      "meta.reports.title": "Relatorios",
      "meta.reports.description": "Descricao relatorios",
      "reports.title": "Relatorios",
      "reports.transactionHistory": "Historico de Transacoes",
    };
    return map[key] ?? key;
  });
});

describe("ReportsPage", () => {
  it("renderiza titulo no PeriodFilterHeader", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetTransactions.mockResolvedValue([]);
    mockGetTransactionChart.mockResolvedValue([]);

    const page = await ReportsPage();
    render(page);

    expect(screen.getByTestId("period-filter-header")).toHaveTextContent("Relatorios");
  });

  it("renderiza container com classes CSS corretas", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetTransactions.mockResolvedValue([]);
    mockGetTransactionChart.mockResolvedValue([]);

    const page = await ReportsPage();
    const { container } = render(page);

    expect(container.firstChild).toHaveClass("w-full", "h-full", "flex", "flex-col", "gap-4", "mb-4");
  });

  it("renderiza child components com undefined quando usuario nao autenticado", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetTransactions.mockResolvedValue([]);
    mockGetTransactionChart.mockResolvedValue([]);

    const page = await ReportsPage();
    render(page);

    expect(screen.getByTestId("summary-card-report")).toHaveAttribute("data-has-transactions", "false");
    expect(screen.getByTestId("chart-area")).toHaveAttribute("data-has-transactions", "false");
    expect(screen.getByTestId("chart-line")).toHaveAttribute("data-has-chart-data", "false");
    expect(screen.getByTestId("transactions-export")).toHaveAttribute("data-has-transactions", "false");
    expect(screen.getByTestId("transactions-table")).toHaveAttribute("data-has-transactions", "false");
  });

  it("renderiza child components com dados quando usuario autenticado", async () => {
    const mockTransactions = [
      {
        id: "1",
        description: "Salario",
        value: 5000,
        type: "income",
        date: new Date("2026-07-10"),
        categoryId: "c1",
        category: { id: "c1", name: "Geral", color: "#000", userId: "u1" },
        walletId: "w1",
        wallet: { id: "w1", name: "Principal", userId: "u1" },
      },
    ];

    const mockChartData = [
      { week: "Semana 1", income: 1000, expense: 500 },
    ];

    mockGetServerSession.mockResolvedValue({ user: { id: "u1" } });
    mockGetTransactions.mockResolvedValue(mockTransactions);
    mockGetTransactionChart.mockResolvedValue(mockChartData);

    const page = await ReportsPage();
    render(page);

    expect(screen.getByTestId("summary-card-report")).toHaveAttribute("data-has-transactions", "true");
    expect(screen.getByTestId("chart-area")).toHaveAttribute("data-has-transactions", "true");
    expect(screen.getByTestId("chart-line")).toHaveAttribute("data-has-chart-data", "true");
    expect(screen.getByTestId("transactions-export")).toHaveAttribute("data-has-transactions", "true");
    expect(screen.getByTestId("transactions-table")).toHaveAttribute("data-has-transactions", "true");
  });

  it("nao chama services quando usuario nao tem id", async () => {
    mockGetServerSession.mockResolvedValue({ user: {} });
    mockGetTransactions.mockResolvedValue([]);
    mockGetTransactionChart.mockResolvedValue([]);

    const page = await ReportsPage();
    render(page);

    expect(mockGetTransactions).not.toHaveBeenCalled();
    expect(mockGetTransactionChart).not.toHaveBeenCalled();
  });

  it("chama getTransactions com mes e ano atuais", async () => {
    const now = new Date();
    mockGetServerSession.mockResolvedValue({ user: { id: "u1" } });
    mockGetTransactions.mockResolvedValue([]);
    mockGetTransactionChart.mockResolvedValue([]);

    await ReportsPage();

    expect(mockGetTransactions).toHaveBeenCalledWith("u1", {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });
  });

  it("chama getTransactionChart com parametros corretos", async () => {
    const now = new Date();
    mockGetServerSession.mockResolvedValue({ user: { id: "u1" } });
    mockGetTransactions.mockResolvedValue([]);
    mockGetTransactionChart.mockResolvedValue([]);

    await ReportsPage();

    expect(mockGetTransactionChart).toHaveBeenCalledWith(
      "u1",
      "week",
      now.getMonth() + 1,
      now.getFullYear(),
    );
  });

  it("renderiza todos os componentes filhos", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetTransactions.mockResolvedValue([]);
    mockGetTransactionChart.mockResolvedValue([]);

    const page = await ReportsPage();
    render(page);

    expect(screen.getByTestId("period-filter-header")).toBeInTheDocument();
    expect(screen.getByTestId("summary-card-report")).toBeInTheDocument();
    expect(screen.getByTestId("chart-area")).toBeInTheDocument();
    expect(screen.getByTestId("chart-line")).toBeInTheDocument();
    expect(screen.getByTestId("transactions-export")).toBeInTheDocument();
    expect(screen.getByTestId("transactions-table")).toBeInTheDocument();
  });

  it("renderiza titulo da secao de historico", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetTransactions.mockResolvedValue([]);
    mockGetTransactionChart.mockResolvedValue([]);

    const page = await ReportsPage();
    render(page);

    expect(screen.getByText("Historico de Transacoes")).toBeInTheDocument();
  });
});

describe("generateMetadata", () => {
  it("retorna metadados dos relatorios", async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: "Relatorios",
      description: "Descricao relatorios",
    });
  });

  it("retorna titulo e description como strings", async () => {
    const metadata = await generateMetadata();

    expect(typeof metadata.title).toBe("string");
    expect(typeof metadata.description).toBe("string");
  });

  it("chama getServerTranslations", async () => {
    await generateMetadata();

    expect(mockGetServerTranslations).toHaveBeenCalled();
  });
});
