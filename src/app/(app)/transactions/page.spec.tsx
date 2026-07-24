import { render, screen } from "@testing-library/react";
import TransactionsPage, { generateMetadata } from "./page";

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

jest.mock("@/components/period-filter-header", () => ({
  __esModule: true,
  PeriodFilterHeader: ({ title }: { title: string }) => (
    <div data-testid="period-filter-header">{title}</div>
  ),
}));

jest.mock("@/components/transactions-table", () => ({
  __esModule: true,
  TransactionsTable: ({ initialTransactions }: { initialTransactions: unknown }) => (
    <div data-testid="transactions-table" data-has-transactions={initialTransactions !== undefined ? "true" : "false"} />
  ),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockGetServerTranslations.mockResolvedValue((key: string) => {
    const map: Record<string, string> = {
      "meta.transactions.title": "Transacoes",
      "meta.transactions.description": "Descricao transacoes",
      "sidebar.transactions": "Transacoes",
    };
    return map[key] ?? key;
  });
});

describe("TransactionsPage", () => {
  it("renderiza titulo no PeriodFilterHeader", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetTransactions.mockResolvedValue([]);

    const page = await TransactionsPage();
    render(page);

    expect(screen.getByTestId("period-filter-header")).toHaveTextContent("Transacoes");
  });

  it("renderiza container com classes CSS corretas", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetTransactions.mockResolvedValue([]);

    const page = await TransactionsPage();
    const { container } = render(page);

    expect(container.firstChild).toHaveClass("w-full", "h-full", "flex", "flex-col", "gap-4");
  });

  it("renderiza TransactionsTable com undefined quando usuario nao autenticado", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetTransactions.mockResolvedValue([]);

    const page = await TransactionsPage();
    render(page);

    expect(screen.getByTestId("transactions-table")).toHaveAttribute("data-has-transactions", "false");
  });

  it("renderiza TransactionsTable com transacoes quando usuario autenticado", async () => {
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

    const page = await TransactionsPage();
    render(page);

    expect(screen.getByTestId("transactions-table")).toHaveAttribute("data-has-transactions", "true");
    expect(mockGetTransactions).toHaveBeenCalledWith("u1", {
      month: expect.any(Number),
      year: expect.any(Number),
    });
  });

  it("nao chama getTransactions quando usuario nao tem id", async () => {
    mockGetServerSession.mockResolvedValue({ user: {} });
    mockGetTransactions.mockResolvedValue([]);

    const page = await TransactionsPage();
    render(page);

    expect(mockGetTransactions).not.toHaveBeenCalled();
  });

  it("chama getTransactions com mes e ano atuais", async () => {
    const now = new Date();
    mockGetServerSession.mockResolvedValue({ user: { id: "u1" } });
    mockGetTransactions.mockResolvedValue([]);

    await TransactionsPage();

    expect(mockGetTransactions).toHaveBeenCalledWith("u1", {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });
  });

  it("renderiza ambos componentes filhos", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetTransactions.mockResolvedValue([]);

    const page = await TransactionsPage();
    render(page);

    expect(screen.getByTestId("period-filter-header")).toBeInTheDocument();
    expect(screen.getByTestId("transactions-table")).toBeInTheDocument();
  });
});

describe("generateMetadata", () => {
  it("retorna metadados das transacoes", async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: "Transacoes",
      description: "Descricao transacoes",
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