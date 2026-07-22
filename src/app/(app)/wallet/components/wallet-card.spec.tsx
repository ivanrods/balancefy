import { render, screen } from "@testing-library/react";
import WalletCard from "./wallet-card";
import { useTranslation } from "@/hooks/use-translation";
import { useCurrency } from "@/context/currency-context";

jest.mock("@/hooks/use-translation");
jest.mock("@/context/currency-context");
jest.mock("@/hooks/use-wallets");

jest.mock("./edit-wallet-dialog", () => ({
  EditWalletDialog: () => <div data-testid="edit-wallet-dialog" />,
}));

jest.mock("./delete-wallet-dialog", () => ({
  DeleteWalletDialog: () => <div data-testid="delete-wallet-dialog" />,
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUseTranslation = jest.mocked(useTranslation);
const mockedUseCurrency = jest.mocked(useCurrency);

const defaultProps = {
  id: "w1",
  name: "Principal",
  balance: 1500,
  totalIncome: 5000,
  totalExpense: 3500,
  lastTransaction: null,
};

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "wallet.currentBalance": "Saldo Atual",
        "wallet.lastMovement": "Último movimento:",
        "wallet.noMovement": "Nenhum movimento",
        "wallet.income": "Receitas",
        "wallet.expenses": "Despesas",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedUseCurrency.mockReturnValue({
    currency: "BRL",
    setCurrency: jest.fn(),
  });
});

describe("WalletCard", () => {
  it("renders wallet name", () => {
    render(<WalletCard {...defaultProps} />);
    expect(screen.getByText("Principal")).toBeInTheDocument();
  });

  it("renders balance formatted", () => {
    render(<WalletCard {...defaultProps} />);
    expect(screen.getByText("R$ 1.500,00")).toBeInTheDocument();
  });

  it("renders total income and expense", () => {
    render(<WalletCard {...defaultProps} />);
    expect(screen.getByText("R$ 5.000,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 3.500,00")).toBeInTheDocument();
  });

  it("renders income and expense labels", () => {
    render(<WalletCard {...defaultProps} />);
    expect(screen.getByText("Receitas")).toBeInTheDocument();
    expect(screen.getByText("Despesas")).toBeInTheDocument();
  });

  it("shows 'Nenhum movimento' when lastTransaction is null", () => {
    render(<WalletCard {...defaultProps} />);
    expect(screen.getByText("Nenhum movimento")).toBeInTheDocument();
  });

  it("shows last transaction amount and type when present", () => {
    render(
      <WalletCard
        {...defaultProps}
        lastTransaction={{ amount: 200, date: "2026-07-20", type: "income" }}
      />,
    );
    expect(screen.getByText("R$ 200,00")).toBeInTheDocument();
    expect(screen.queryByText("Nenhum movimento")).not.toBeInTheDocument();
  });

  it("applies green class for income last transaction", () => {
    render(
      <WalletCard
        {...defaultProps}
        lastTransaction={{ amount: 200, date: "2026-07-20", type: "income" }}
      />,
    );
    const span = screen.getByText("R$ 200,00");
    expect(span.className).toContain("text-green-500");
  });

  it("applies red class for expense last transaction", () => {
    render(
      <WalletCard
        {...defaultProps}
        lastTransaction={{ amount: 100, date: "2026-07-20", type: "expense" }}
      />,
    );
    const span = screen.getByText("R$ 100,00");
    expect(span.className).toContain("text-red-500");
  });

  it("renders edit and delete dialog buttons", () => {
    render(<WalletCard {...defaultProps} />);
    expect(screen.getByTestId("edit-wallet-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("delete-wallet-dialog")).toBeInTheDocument();
  });

  it("renders current balance label", () => {
    render(<WalletCard {...defaultProps} />);
    expect(screen.getByText("Saldo Atual")).toBeInTheDocument();
  });
});
