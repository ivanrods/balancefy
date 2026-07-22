import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DeleteWalletDialog } from "./delete-wallet-dialog";
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
        "wallet.deleteTitle": "Excluir Carteira",
        "wallet.deleteDescription": "Tem certeza que deseja excluir esta carteira?",
        "wallet.deleted": "Carteira excluída com sucesso!",
        "wallet.deleteError": "Erro ao excluir carteira",
        "wallet.cancel": "Cancelar",
        "wallet.deleteConfirm": "Excluir",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedUseWalletsMutations.mockReturnValue({
    createWallet: { mutate: jest.fn() },
    updateWallet: { mutate: jest.fn() },
    deleteWallet: { mutate: mockMutate },
  } as unknown as ReturnType<typeof useWalletsMutations>);

  mockedToast.success = jest.fn();
  mockedToast.error = jest.fn();
});

function getTrigger() {
  return screen.getByText("Excluir Carteira");
}

describe("DeleteWalletDialog", () => {
  it("renders trigger", () => {
    render(<DeleteWalletDialog id="w-1" />);
    expect(getTrigger()).toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", () => {
    render(<DeleteWalletDialog id="w-1" />);
    fireEvent.click(getTrigger());
    expect(
      screen.getByText("Tem certeza que deseja excluir esta carteira?"),
    ).toBeInTheDocument();
  });

  it("calls deleteWallet.mutate with id on confirm", async () => {
    render(<DeleteWalletDialog id="w-1" />);
    fireEvent.click(getTrigger());

    const deleteButton = screen.getByText("Excluir");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    expect(mockMutate).toHaveBeenCalledWith("w-1", expect.any(Object));
  });

  it("calls toast.success on successful mutation", async () => {
    mockMutate.mockImplementation((_id, { onSuccess }) => {
      onSuccess();
    });

    render(<DeleteWalletDialog id="w-1" />);
    fireEvent.click(getTrigger());

    const deleteButton = screen.getByText("Excluir");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith(
        "Carteira excluída com sucesso!",
      );
    });
  });

  it("calls toast.error on failed mutation", async () => {
    mockMutate.mockImplementation((_id, { onError }) => {
      onError();
    });

    render(<DeleteWalletDialog id="w-1" />);
    fireEvent.click(getTrigger());

    const deleteButton = screen.getByText("Excluir");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith(
        "Erro ao excluir carteira",
      );
    });
  });

  it("closes dialog on cancel", () => {
    render(<DeleteWalletDialog id="w-1" />);
    fireEvent.click(getTrigger());

    expect(
      screen.getByText("Tem certeza que deseja excluir esta carteira?"),
    ).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(
      screen.queryByText("Tem certeza que deseja excluir esta carteira?"),
    ).not.toBeInTheDocument();
  });
});
