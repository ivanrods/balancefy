import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

jest.mock("@/hooks/use-translation");
jest.mock("sonner");
jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-item">{children}</div>
  ),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUseTranslation = jest.mocked(useTranslation);
const mockedToast = jest.mocked(toast);
const mockedSignOut = jest.mocked(signOut);

let mockFetch: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "nav.deleteAccount": "Excluir Conta",
        "deleteAccount.title": "Excluir Conta",
        "deleteAccount.description":
          "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
        "deleteAccount.cancel": "Cancelar",
        "deleteAccount.confirm": "Excluir",
        "deleteAccount.success": "Conta excluída com sucesso!",
        "deleteAccount.error": "Erro ao excluir conta",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedToast.success = jest.fn();
  mockedToast.error = jest.fn();

  mockFetch = jest.fn();
  globalThis.fetch = mockFetch;
});

function openDialog() {
  fireEvent.click(screen.getByRole("button", { name: /Excluir Conta/i }));
}

describe("DeleteAccountDialog", () => {
  it("renders trigger", () => {
    render(<DeleteAccountDialog />);
    expect(screen.getByRole("button", { name: /Excluir Conta/i })).toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", () => {
    render(<DeleteAccountDialog />);
    openDialog();
    expect(screen.getByRole("heading", { name: "Excluir Conta" })).toBeInTheDocument();
  });

  it("calls fetch DELETE on confirm and calls toast.success and signOut", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Conta excluída com sucesso!" }),
    });

    render(<DeleteAccountDialog />);
    openDialog();

    const deleteButton = screen.getByRole("button", { name: /Excluir/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/profile", {
        method: "DELETE",
      });
    });

    expect(mockedToast.success).toHaveBeenCalledWith("Conta excluída com sucesso!");
    expect(mockedSignOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });

  it("calls toast.error on failed fetch", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Erro ao excluir conta"));

    render(<DeleteAccountDialog />);
    openDialog();

    const deleteButton = screen.getByRole("button", { name: /Excluir/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith("Erro ao excluir conta");
    });
  });

  it("calls toast.error when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Erro ao excluir conta" }),
    });

    render(<DeleteAccountDialog />);
    openDialog();

    const deleteButton = screen.getByRole("button", { name: /Excluir/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith("Erro ao excluir conta");
    });
  });

  it("closes dialog on cancel", () => {
    render(<DeleteAccountDialog />);
    openDialog();

    expect(screen.getByRole("heading", { name: "Excluir Conta" })).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByRole("heading", { name: "Excluir Conta" })).not.toBeInTheDocument();
  });
});
