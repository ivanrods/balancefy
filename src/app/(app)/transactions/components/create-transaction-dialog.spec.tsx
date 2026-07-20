import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransactionDialog } from "./create-transaction-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { useTransactionsMutations } from "@/hooks/use-transactions";
import { toast } from "sonner";

jest.mock("@/hooks/use-translation");
jest.mock("@/hooks/use-transactions");
jest.mock("sonner");

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

jest.mock("./select-category", () => ({
  SelectCategory: ({ value, onValueChange }: { value: string; onValueChange: (v: string) => void }) => (
    <select data-testid="select-category" value={value} onChange={(e) => onValueChange(e.target.value)}>
      <option value="">Selecione</option>
      <option value="cat1">Trabalho</option>
    </select>
  ),
}));

jest.mock("./select-wallet", () => ({
  SelectWallet: ({ value, onValueChange }: { value: string; onValueChange: (v: string) => void }) => (
    <select data-testid="select-wallet" value={value} onChange={(e) => onValueChange(e.target.value)}>
      <option value="">Selecione</option>
      <option value="wallet1">Principal</option>
    </select>
  ),
}));

jest.mock("./date-dialog", () => ({
  DateDialog: ({ value, onChange }: { value: Date; onChange: (d: Date) => void }) => (
    <input data-testid="date-dialog" type="date" value={value.toISOString().split("T")[0]} onChange={(e) => onChange(new Date(e.target.value))} />
  ),
}));

jest.mock("./radio-group-select", () => ({
  RadioGroupSelect: ({ value, onValueChange }: { value: string; onValueChange: (v: string) => void }) => (
    <select data-testid="radio-group" value={value} onChange={(e) => onValueChange(e.target.value)}>
      <option value="income">Entrada</option>
      <option value="expense">Saída</option>
    </select>
  ),
}));

const mockedUseTranslation = jest.mocked(useTranslation);
const mockedUseTransactionsMutations = jest.mocked(useTransactionsMutations);
const mockedToast = jest.mocked(toast);

const mockMutate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "transaction.newTransaction": "Nova Transação",
        "transaction.addTitle": "Adicionar Transação",
        "transaction.addDescription": "Preencha o formulário",
        "transaction.description": "Descrição",
        "transaction.value": "Valor",
        "transaction.cancel": "Cancelar",
        "transaction.save": "Salvar",
        "transaction.success": "Transação criada",
        "transaction.error": "Erro ao criar",
        "transaction.selectCategory": "Categoria",
        "transaction.selectWallet": "Carteira",
        "transaction.selectDate": "Data",
        "transaction.income": "Entrada",
        "transaction.expense": "Saída",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedUseTransactionsMutations.mockReturnValue({
    createTransaction: { mutate: mockMutate },
  } as unknown as ReturnType<typeof useTransactionsMutations>);

  mockedToast.success = jest.fn();
  mockedToast.error = jest.fn();

  global.fetch = jest.fn().mockResolvedValue({
    json: () =>
      Promise.resolve([
        { id: "cat1", name: "Trabalho" },
      ]),
  });
});

function getOpenButton() {
  return screen.getByRole("button", { name: /Nova Transação/i });
}

function openDialog() {
  fireEvent.click(getOpenButton());
}

describe("TransactionDialog", () => {
  it("renders trigger button", () => {
    render(<TransactionDialog />);
    expect(getOpenButton()).toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", () => {
    render(<TransactionDialog />);
    openDialog();
    expect(screen.getByText("Adicionar Transação")).toBeInTheDocument();
  });

  it("displays form fields inside dialog", () => {
    render(<TransactionDialog />);
    openDialog();
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor")).toBeInTheDocument();
    expect(screen.getByTestId("select-category")).toBeInTheDocument();
    expect(screen.getByTestId("select-wallet")).toBeInTheDocument();
    expect(screen.getByTestId("date-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("radio-group")).toBeInTheDocument();
  });

  it("calls createTransaction.mutate on valid submit", async () => {
    render(<TransactionDialog />);
    openDialog();

    await userEvent.type(screen.getByLabelText("Descrição"), "Freela");
    await userEvent.type(screen.getByLabelText("Valor"), "5000");

    fireEvent.change(screen.getByTestId("select-wallet"), {
      target: { value: "wallet1" },
    });
    fireEvent.change(screen.getByTestId("select-category"), {
      target: { value: "cat1" },
    });

    const saveButton = screen.getByRole("button", { name: /Salvar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    const callArg = mockMutate.mock.calls[0][0];
    expect(callArg.description).toBe("Freela");
    expect(Number(callArg.value)).toBe(5000);
    expect(callArg.type).toBe("income");
    expect(callArg.walletId).toBe("wallet1");
    expect(callArg.categoryId).toBe("cat1");
  });

  it("shows validation errors for empty form", async () => {
    render(<TransactionDialog />);
    openDialog();

    const saveButton = screen.getByRole("button", { name: /Salvar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("A descrição deve ter pelo menos 3 caracteres"),
      ).toBeInTheDocument();
    });
  });

  it("calls toast.success on successful mutation", async () => {
    mockMutate.mockImplementation((_data, { onSuccess }) => {
      onSuccess();
    });

    render(<TransactionDialog />);
    openDialog();

    await userEvent.type(screen.getByLabelText("Descrição"), "Freela");
    await userEvent.type(screen.getByLabelText("Valor"), "5000");
    fireEvent.change(screen.getByTestId("select-wallet"), {
      target: { value: "wallet1" },
    });
    fireEvent.change(screen.getByTestId("select-category"), {
      target: { value: "cat1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith("Transação criada");
    });
  });

  it("calls toast.error on failed mutation", async () => {
    mockMutate.mockImplementation((_data, { onError }) => {
      onError();
    });

    render(<TransactionDialog />);
    openDialog();

    await userEvent.type(screen.getByLabelText("Descrição"), "Freela");
    await userEvent.type(screen.getByLabelText("Valor"), "5000");
    fireEvent.change(screen.getByTestId("select-wallet"), {
      target: { value: "wallet1" },
    });
    fireEvent.change(screen.getByTestId("select-category"), {
      target: { value: "cat1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith("Erro ao criar");
    });
  });

  it("cancels button closes dialog", () => {
    render(<TransactionDialog />);
    openDialog();
    expect(screen.getByText("Adicionar Transação")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(screen.queryByText("Adicionar Transação")).not.toBeInTheDocument();
  });
});
