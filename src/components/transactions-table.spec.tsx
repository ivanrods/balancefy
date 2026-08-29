import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CurrencyProvider } from "@/context/currency-context";
import { LocaleProvider } from "@/context/locale-context";
import { TransactionsTable } from "@/components/transactions-table";

jest.mock("@/context/period-context", () => ({
  PeriodProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  usePeriod: jest.fn(() => ({
    mode: "total" as const,
    setMode: jest.fn(),
    selectedMonth: 7,
    setSelectedMonth: jest.fn(),
  })),
}));

jest.mock("@/app/(app)/transactions/components/edit-transaction-dialog", () => ({
  EditTransactionDialog: () => <div data-testid="edit-dialog" />,
}));

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={qc}>
        <CurrencyProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </CurrencyProvider>
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
  userId: "u1",
  category: { id: "c1", name: "Trabalho", color: "#000", userId: "u1" },
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

  render(<TransactionsTable />, { wrapper: createWrapper() });
  expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
});

it("exibe mensagem vazia quando não há transações", async () => {
  render(<TransactionsTable />, { wrapper: createWrapper() });

  await waitFor(() => {
    expect(screen.getByText("Nenhuma transação encontrada.")).toBeInTheDocument();
  });
});

it("renderiza transações na tabela", async () => {
  mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([mockTransaction]) });

  render(<TransactionsTable />, { wrapper: createWrapper() });

  await waitFor(() => {
    expect(screen.getByText("Salário")).toBeInTheDocument();
    expect(screen.getByText("Trabalho")).toBeInTheDocument();
    expect(screen.getByText("Principal")).toBeInTheDocument();
    expect(screen.getByText("Entrada")).toBeInTheDocument();
    expect(screen.getByText("R$ 5.000,00")).toBeInTheDocument();
  });
});

it("usa initialTransactions", async () => {
  render(<TransactionsTable initialTransactions={[mockTransaction]} />, {
    wrapper: createWrapper(),
  });

  await screen.findByText("Salário");
});
