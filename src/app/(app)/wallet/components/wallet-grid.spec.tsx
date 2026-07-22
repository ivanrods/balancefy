import { render, screen } from "@testing-library/react";
import WalletGrid from "./wallet-grid";
import { useTranslation } from "@/hooks/use-translation";
import { useWalletsQuery } from "@/hooks/use-wallets";
import { usePeriod } from "@/context/period-context";

jest.mock("@/hooks/use-translation");
jest.mock("@/hooks/use-wallets");
jest.mock("@/context/period-context", () => ({
  usePeriod: jest.fn(),
}));

jest.mock("./wallet-card", () => ({
  __esModule: true,
  default: ({ id, name }: { id: string; name: string }) => (
    <div data-testid="wallet-card" data-id={id} data-name={name} />
  ),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUseTranslation = jest.mocked(useTranslation);
const mockedUseWalletsQuery = jest.mocked(useWalletsQuery);
const mockedUsePeriod = jest.mocked(usePeriod);

const mockWallets = [
  {
    id: "w1",
    name: "Principal",
    balance: 1500,
    totalIncome: 5000,
    totalExpense: 3500,
    lastTransaction: null,
  },
  {
    id: "w2",
    name: "Poupança",
    balance: 10000,
    totalIncome: 12000,
    totalExpense: 2000,
    lastTransaction: { amount: 500, date: "2026-07-20", type: "income" as const },
  },
];

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "wallet.noWallet": "Nenhuma carteira encontrada",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedUsePeriod.mockReturnValue({
    mode: "total",
    setMode: jest.fn(),
    selectedMonth: 7,
    setSelectedMonth: jest.fn(),
  });

  mockedUseWalletsQuery.mockReturnValue({
    data: mockWallets,
    isLoading: false,
  } as unknown as ReturnType<typeof useWalletsQuery>);
});

describe("WalletGrid", () => {
  it("renders skeleton when loading and no data", () => {
    mockedUseWalletsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useWalletsQuery>);

    const { container } = render(<WalletGrid />);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons).toHaveLength(3);
  });

  it("renders wallet cards for each wallet", () => {
    render(<WalletGrid />);
    const cards = screen.getAllByTestId("wallet-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveAttribute("data-name", "Principal");
    expect(cards[1]).toHaveAttribute("data-name", "Poupança");
  });

  it("shows empty message when wallets is empty", () => {
    mockedUseWalletsQuery.mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useWalletsQuery>);

    render(<WalletGrid />);
    expect(screen.getByText("Nenhuma carteira encontrada")).toBeInTheDocument();
  });

  it("passes month params when mode is month", () => {
    mockedUsePeriod.mockReturnValue({
      mode: "month",
      setMode: jest.fn(),
      selectedMonth: 7,
      setSelectedMonth: jest.fn(),
    });

    render(<WalletGrid />);
    expect(mockedUseWalletsQuery).toHaveBeenCalledWith(
      { month: 7, year: new Date().getFullYear() },
      undefined,
    );
  });

  it("passes undefined filter when mode is total", () => {
    render(<WalletGrid />);
    expect(mockedUseWalletsQuery).toHaveBeenCalledWith(
      undefined,
      undefined,
    );
  });

  it("passes initialWallets to query", () => {
    render(<WalletGrid initialWallets={mockWallets} />);
    expect(mockedUseWalletsQuery).toHaveBeenCalledWith(
      undefined,
      mockWallets,
    );
  });
});
