import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditTransactionDialog } from "./edit-transaction-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { useTransactionsMutations } from "@/hooks/use-transactions";
import { toast } from "sonner";

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
  }) => (
    <button data-testid="dialog-trigger" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock("@/hooks/use-translation");
jest.mock("@/hooks/use-transactions");
jest.mock("sonner");

jest.mock("./select-category", () => ({
  SelectCategory: ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (v: string) => void;
  }) => (
    <select
      data-testid="select-category"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option value="">Selecione</option>
      <option value="cat1">Trabalho</option>
    </select>
  ),
}));

jest.mock("./select-wallet", () => ({
  SelectWallet: ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (v: string) => void;
  }) => (
    <select
      data-testid="select-wallet"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option value="">Selecione</option>
      <option value="wallet1">Principal</option>
    </select>
  ),
}));

jest.mock("./date-dialog", () => ({
  DateDialog: ({ value, onChange }: { value: Date; onChange: (d: Date) => void }) => (
    <input
      data-testid="date-dialog"
      type="date"
      value={value.toISOString().split("T")[0]}
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));

jest.mock("./radio-group-select", () => ({
  RadioGroupSelect: ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (v: string) => void;
  }) => (
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

const mockTransaction = {
  id: "tx-1",
  description: "Freelance original",
  value: 3000,
  type: "income" as const,
  date: new Date("2025-03-10"),
  categoryId: "cat1",
  userId: "u1",
  category: { id: "cat1", name: "Trabalho", color: "#000", userId: "u1" },
  walletId: "wallet1",
  wallet: { id: "wallet1", name: "Principal", userId: "u1" },
};

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "transaction.editTitle": "Editar Transação",
        "transaction.editDescription": "Faça alterações na sua transação.",
        "transaction.description": "Descrição",
        "transaction.value": "Valor",
        "transaction.cancel": "Cancelar",
        "transaction.saveChanges": "Salvar alterações",
        "transaction.editSuccess": "Transação atualizada com sucesso!",
        "transaction.editError": "Erro ao atualizar transação!",
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
    updateTransaction: { mutate: mockMutate },
  } as unknown as ReturnType<typeof useTransactionsMutations>);

  mockedToast.success = jest.fn();
  mockedToast.error = jest.fn();

  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve([]),
  });
});

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

function getTrigger() {
  return screen.getByText("Editar Transação");
}

describe("EditTransactionDialog", () => {
  it("renders trigger", () => {
    render(<EditTransactionDialog transaction={mockTransaction} />);
    expect(getTrigger()).toBeInTheDocument();
  });

  it("opens dialog with pre-filled values", () => {
    render(<EditTransactionDialog transaction={mockTransaction} />);
    fireEvent.click(getTrigger());

    expect(screen.getByText("Faça alterações na sua transação.")).toBeInTheDocument();
    const descInput = screen.getByLabelText("Descrição") as HTMLInputElement;
    expect(descInput.value).toBe("Freelance original");
  });

  it("calls updateTransaction.mutate on valid submit with updated values", async () => {
    render(<EditTransactionDialog transaction={mockTransaction} />);
    fireEvent.click(getTrigger());

    const descInput = screen.getByLabelText("Descrição");
    await userEvent.clear(descInput);
    await userEvent.type(descInput, "Freela atualizado");

    const valorInput = screen.getByLabelText("Valor");
    await userEvent.clear(valorInput);
    await userEvent.type(valorInput, "5000");

    fireEvent.change(screen.getByTestId("select-wallet"), {
      target: { value: "wallet1" },
    });
    fireEvent.change(screen.getByTestId("select-category"), {
      target: { value: "cat1" },
    });
    fireEvent.change(screen.getByTestId("radio-group"), {
      target: { value: "expense" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Salvar alterações/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    const callArg = mockMutate.mock.calls[0][0];
    expect(callArg.id).toBe("tx-1");
    expect(callArg.description).toBe("Freela atualizado");
    expect(Number(callArg.value)).toBe(5000);
    expect(callArg.type).toBe("expense");
  });

  it("shows validation errors for invalid description", async () => {
    render(<EditTransactionDialog transaction={mockTransaction} />);
    fireEvent.click(getTrigger());

    const descInput = screen.getByLabelText("Descrição");
    await userEvent.clear(descInput);
    await userEvent.type(descInput, "ab");

    fireEvent.click(screen.getByRole("button", { name: /Salvar alterações/i }));

    await waitFor(() => {
      expect(screen.getByText("A descrição deve ter pelo menos 3 caracteres")).toBeInTheDocument();
    });
  });

  it("calls toast.success on successful mutation", async () => {
    mockMutate.mockImplementation((_data, { onSuccess }) => {
      onSuccess();
    });

    render(<EditTransactionDialog transaction={mockTransaction} />);
    fireEvent.click(getTrigger());

    fireEvent.click(screen.getByRole("button", { name: /Salvar alterações/i }));

    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith("Transação atualizada com sucesso!");
    });
  });

  it("calls toast.error on failed mutation", async () => {
    mockMutate.mockImplementation((_data, { onError }) => {
      onError();
    });

    render(<EditTransactionDialog transaction={mockTransaction} />);
    fireEvent.click(getTrigger());

    fireEvent.click(screen.getByRole("button", { name: /Salvar alterações/i }));

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith("Erro ao atualizar transação!");
    });
  });

  it("uses defaultValues from transaction prop", () => {
    render(<EditTransactionDialog transaction={mockTransaction} />);
    fireEvent.click(getTrigger());

    const descInput = screen.getByLabelText("Descrição") as HTMLInputElement;
    const valorInput = screen.getByLabelText("Valor") as HTMLInputElement;

    expect(descInput.value).toBe("Freelance original");
    expect(Number(valorInput.value)).toBe(3000);
  });

  it("closes dialog on cancel", () => {
    render(<EditTransactionDialog transaction={mockTransaction} />);
    fireEvent.click(getTrigger());

    expect(screen.getByText("Faça alterações na sua transação.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(screen.queryByText("Faça alterações na sua transação.")).not.toBeInTheDocument();
  });
});
