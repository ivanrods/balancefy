import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditWalletDialog } from "./edit-wallet-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { useWalletsMutations } from "@/hooks/use-wallets";
import { toast } from "sonner";

jest.mock("@/hooks/use-translation");
jest.mock("@/hooks/use-wallets");
jest.mock("sonner");

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUseTranslation = jest.mocked(useTranslation);
const mockedUseWalletsMutations = jest.mocked(useWalletsMutations);
const mockedToast = jest.mocked(toast);

const mockMutate = jest.fn();

const mockWallet = { id: "w1", name: "Principal" };

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "wallet.editTitle": "Editar Carteira",
        "wallet.editDescription": "Faça alterações na sua carteira.",
        "wallet.name": "Nome",
        "wallet.save": "Salvar alterações",
        "wallet.cancel": "Cancelar",
        "wallet.editSuccess": "Carteira atualizada com sucesso!",
        "wallet.editError": "Erro ao atualizar carteira",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedUseWalletsMutations.mockReturnValue({
    createWallet: { mutate: jest.fn() },
    updateWallet: { mutate: mockMutate },
    deleteWallet: { mutate: jest.fn() },
  } as unknown as ReturnType<typeof useWalletsMutations>);

  mockedToast.success = jest.fn();
  mockedToast.error = jest.fn();
});

function getTrigger() {
  return screen.getByText("Editar Carteira");
}

describe("EditWalletDialog", () => {
  it("renders trigger", () => {
    render(<EditWalletDialog wallets={mockWallet} />);
    expect(getTrigger()).toBeInTheDocument();
  });

  it("opens dialog with pre-filled name", () => {
    render(<EditWalletDialog wallets={mockWallet} />);
    fireEvent.click(getTrigger());

    expect(screen.getByText("Faça alterações na sua carteira.")).toBeInTheDocument();
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("Principal");
  });

  it("calls updateWallet.mutate on valid submit with updated name", async () => {
    render(<EditWalletDialog wallets={mockWallet} />);
    fireEvent.click(getTrigger());

    const input = screen.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "Renomeado");

    fireEvent.click(screen.getByRole("button", { name: /Salvar alterações/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    const callArg = mockMutate.mock.calls[0][0];
    expect(callArg.id).toBe("w1");
    expect(callArg.name).toBe("Renomeado");
  });

  it("shows validation error for short name", async () => {
    render(<EditWalletDialog wallets={mockWallet} />);
    fireEvent.click(getTrigger());

    const input = screen.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "ab");

    fireEvent.click(screen.getByRole("button", { name: /Salvar alterações/i }));

    await waitFor(() => {
      expect(
        screen.getByText("O nome da carteira deve ter pelo menos 3 caracteres"),
      ).toBeInTheDocument();
    });
  });

  it("calls toast.success on successful mutation", async () => {
    mockMutate.mockImplementation((_data, { onSuccess }) => {
      onSuccess();
    });

    render(<EditWalletDialog wallets={mockWallet} />);
    fireEvent.click(getTrigger());

    fireEvent.click(screen.getByRole("button", { name: /Salvar alterações/i }));

    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith("Carteira atualizada com sucesso!");
    });
  });

  it("calls toast.error on failed mutation", async () => {
    mockMutate.mockImplementation((_data, { onError }) => {
      onError();
    });

    render(<EditWalletDialog wallets={mockWallet} />);
    fireEvent.click(getTrigger());

    fireEvent.click(screen.getByRole("button", { name: /Salvar alterações/i }));

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith("Erro ao atualizar carteira");
    });
  });

  it("uses defaultValues from wallets prop", () => {
    render(<EditWalletDialog wallets={{ id: "w2", name: "Investimentos" }} />);
    fireEvent.click(getTrigger());

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("Investimentos");
  });

  it("closes dialog on cancel", () => {
    render(<EditWalletDialog wallets={mockWallet} />);
    fireEvent.click(getTrigger());

    expect(screen.getByText("Faça alterações na sua carteira.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(screen.queryByText("Faça alterações na sua carteira.")).not.toBeInTheDocument();
  });
});
