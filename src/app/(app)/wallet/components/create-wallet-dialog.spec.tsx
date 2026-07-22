import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WalletDialog } from "./create-wallet-dialog";
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

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "wallet.newWallet": "Nova Carteira",
        "wallet.addTitle": "Adicionar Carteira",
        "wallet.addDescription": "Preencha o nome da nova carteira.",
        "wallet.name": "Nome",
        "wallet.add": "Adicionar",
        "wallet.cancel": "Cancelar",
        "wallet.success": "Carteira criada com sucesso!",
        "wallet.error": "Erro ao criar carteira",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedUseWalletsMutations.mockReturnValue({
    createWallet: { mutate: mockMutate },
    updateWallet: { mutate: jest.fn() },
    deleteWallet: { mutate: jest.fn() },
  } as unknown as ReturnType<typeof useWalletsMutations>);

  mockedToast.success = jest.fn();
  mockedToast.error = jest.fn();
});

function getTrigger() {
  return screen.getByRole("button", { name: /Nova Carteira/i });
}

function openDialog() {
  fireEvent.click(getTrigger());
}

describe("WalletDialog", () => {
  it("renders trigger button", () => {
    render(<WalletDialog />);
    expect(getTrigger()).toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", () => {
    render(<WalletDialog />);
    openDialog();
    expect(screen.getByText("Adicionar Carteira")).toBeInTheDocument();
  });

  it("displays name input", () => {
    render(<WalletDialog />);
    openDialog();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls createWallet.mutate on valid submit", async () => {
    render(<WalletDialog />);
    openDialog();

    await userEvent.type(screen.getByRole("textbox"), "Minha Carteira");

    const saveButton = screen.getByRole("button", { name: /Adicionar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    const callArg = mockMutate.mock.calls[0][0];
    expect(callArg.name).toBe("Minha Carteira");
  });

  it("shows validation error for short name", async () => {
    render(<WalletDialog />);
    openDialog();

    await userEvent.type(screen.getByRole("textbox"), "ab");

    const saveButton = screen.getByRole("button", { name: /Adicionar/i });
    fireEvent.click(saveButton);

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

    render(<WalletDialog />);
    openDialog();

    await userEvent.type(screen.getByRole("textbox"), "Minha Carteira");

    const saveButton = screen.getByRole("button", { name: /Adicionar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith(
        "Carteira criada com sucesso!",
      );
    });
  });

  it("calls toast.error on failed mutation", async () => {
    mockMutate.mockImplementation((_data, { onError }) => {
      onError();
    });

    render(<WalletDialog />);
    openDialog();

    await userEvent.type(screen.getByRole("textbox"), "Minha Carteira");

    const saveButton = screen.getByRole("button", { name: /Adicionar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith(
        "Erro ao criar carteira",
      );
    });
  });

  it("closes dialog on cancel", () => {
    render(<WalletDialog />);
    openDialog();
    expect(screen.getByText("Adicionar Carteira")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelButton);

    expect(
      screen.queryByText("Adicionar Carteira"),
    ).not.toBeInTheDocument();
  });

  it("resets form after successful creation", async () => {
    mockMutate.mockImplementation((_data, { onSuccess }) => {
      onSuccess();
    });

    render(<WalletDialog />);
    openDialog();

    await userEvent.type(screen.getByRole("textbox"), "Minha Carteira");

    const saveButton = screen.getByRole("button", { name: /Adicionar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("");
    });
  });
});
