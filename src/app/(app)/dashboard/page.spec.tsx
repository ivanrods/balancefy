import { render, screen } from "@testing-library/react";
import Dashboard, { generateMetadata } from "./page";

const mockGetServerTranslations = jest.fn();
const mockGetServerSession = jest.fn();
const mockGetTransactions = jest.fn();

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
}));

jest.mock("../../../components/chart-area", () => ({
  __esModule: true,
  ChartArea: ({ initialTransactions }: { initialTransactions: unknown }) => (
    <div data-testid="chart-area" data-has-transactions={initialTransactions !== undefined ? "true" : "false"} />
  ),
}));

jest.mock("./components/chart-pie-donut", () => ({
  __esModule: true,
  ChartPieDonut: ({ initialTransactions }: { initialTransactions: unknown }) => (
    <div data-testid="chart-pie-donut" data-has-transactions={initialTransactions !== undefined ? "true" : "false"} />
  ),
}));

jest.mock("@/components/transactions-table", () => ({
  __esModule: true,
  TransactionsTable: ({ initialTransactions }: { initialTransactions: unknown }) => (
    <div data-testid="transactions-table" data-has-transactions={initialTransactions !== undefined ? "true" : "false"} />
  ),
}));

jest.mock("./components/summary", () => ({
  __esModule: true,
  default: ({ initialTransactions }: { initialTransactions: unknown }) => (
    <div data-testid="summary" data-has-transactions={initialTransactions !== undefined ? "true" : "false"} />
  ),
}));

jest.mock("@/components/period-filter-header", () => ({
  __esModule: true,
  PeriodFilterHeader: ({ title }: { title: string }) => (
    <div data-testid="period-filter-header">{title}</div>
  ),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockGetServerTranslations.mockResolvedValue((key: string) => {
    const map: Record<string, string> = {
      "meta.dashboard.title": "Dashboard",
      "meta.dashboard.description": "Dashboard description",
      "sidebar.dashboard": "Dashboard",
    };
    return map[key] ?? key;
  });
});

describe("Dashboard Page", () => {
  it("renderiza titulo no PeriodFilterHeader", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetTransactions.mockResolvedValue([]);

    const page = await Dashboard();
    render(page);

    expect(screen.getByTestId("period-filter-header")).toHaveTextContent("Dashboard");
  });

  it("renderiza child components com undefined quando usuario nao autenticado", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetTransactions.mockResolvedValue([]);

    const page = await Dashboard();
    render(page);

    expect(screen.getByTestId("summary")).toHaveAttribute("data-has-transactions", "false");
    expect(screen.getByTestId("chart-area")).toHaveAttribute("data-has-transactions", "false");
    expect(screen.getByTestId("chart-pie-donut")).toHaveAttribute("data-has-transactions", "false");
    expect(screen.getByTestId("transactions-table")).toHaveAttribute("data-has-transactions", "false");
  });

  it("renderiza child components com transacoes quando usuario autenticado", async () => {
    const mockTransactions = [
      {
        id: "1",
        description: "Salário",
        value: 5000,
        type: "income",
        date: new Date("2026-07-10"),
        categoryId: "c1",
        category: { id: "c1", name: "Geral", color: "#000", userId: "u1" },
        walletId: "w1",
        wallet: { id: "w1", name: "Principal", userId: "u1" },
      },
    ];

    mockGetServerSession.mockResolvedValue({ user: { id: "u1" } });
    mockGetTransactions.mockResolvedValue(mockTransactions);

    const page = await Dashboard();
    render(page);

    expect(screen.getByTestId("summary")).toHaveAttribute("data-has-transactions", "true");
    expect(screen.getByTestId("chart-area")).toHaveAttribute("data-has-transactions", "true");
    expect(mockGetTransactions).toHaveBeenCalledWith("u1", {
      month: expect.any(Number),
      year: expect.any(Number),
    });
  });

  it("nao chama getTransactions quando usuario nao tem id", async () => {
    mockGetServerSession.mockResolvedValue({ user: {} });
    mockGetTransactions.mockResolvedValue([]);

    const page = await Dashboard();
    render(page);

    expect(mockGetTransactions).not.toHaveBeenCalled();
  });
});

describe("generateMetadata", () => {
  it("retorna metadados do dashboard", async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: "Dashboard",
      description: "Dashboard description",
    });
  });
});