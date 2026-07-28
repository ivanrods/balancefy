import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditProfile } from "./edit-profile";
import { useTranslation } from "@/hooks/use-translation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

jest.mock("@/hooks/use-translation");
jest.mock("next-auth/react");
jest.mock("sonner");

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-item">{children}</div>
  ),
}));

jest.mock("./avatar-profile", () => ({
  AvatarProfile: ({ disabled }: { disabled?: boolean }) => (
    <div data-testid="avatar-profile" data-disabled={disabled} />
  ),
}));

jest.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet">{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-trigger">{children}</div>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content">{children}</div>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  SheetDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  SheetFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetClose: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-close">{children}</div>
  ),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUseTranslation = jest.mocked(useTranslation);
const mockedUseSession = jest.mocked(useSession);
const mockedToast = jest.mocked(toast);

const mockUpdate = jest.fn();
let mockFetch: jest.Mock;

const defaultSession = {
  data: {
    user: { name: "User", email: "user@email.com", image: null },
    expires: "2099-01-01",
  },
  status: "authenticated",
  update: mockUpdate,
};

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "nav.editProfile": "Editar Perfil",
        "profile.editTitle": "Editar Perfil",
        "profile.editDescription": "Atualize suas informações.",
        "profile.name": "Nome",
        "profile.namePlaceholder": "Seu nome",
        "profile.email": "E-mail",
        "profile.emailPlaceholder": "seu@email.com",
        "profile.password": "Senha",
        "profile.passwordPlaceholder": "Nova senha",
        "profile.save": "Salvar",
        "profile.close": "Fechar",
        "profile.success": "Perfil atualizado com sucesso!",
        "profile.error": "Erro ao atualizar perfil",
        "profile.imageError": "Erro ao fazer upload da imagem",
        "profile.googleAlert": "Conta vinculada ao Google. Para alterar, use o Google.",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedUseSession.mockReturnValue(defaultSession as unknown as ReturnType<typeof useSession>);

  mockedToast.success = jest.fn();
  mockedToast.error = jest.fn();
});

describe("EditProfile", () => {
  it("renders trigger and title", () => {
    mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    globalThis.fetch = mockFetch;

    render(<EditProfile />);
    const texts = screen.getAllByText("Editar Perfil");
    expect(texts).toHaveLength(2);
  });

  it("renders sheet content", () => {
    mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    globalThis.fetch = mockFetch;

    render(<EditProfile />);
    expect(screen.getByText("Atualize suas informações.")).toBeInTheDocument();
  });

  it("renders avatar profile", () => {
    mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    globalThis.fetch = mockFetch;

    render(<EditProfile />);
    expect(screen.getByTestId("avatar-profile")).toBeInTheDocument();
  });

  it("renders name, email and password inputs", () => {
    mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    globalThis.fetch = mockFetch;

    render(<EditProfile />);
    expect(screen.getByPlaceholderText("Seu nome")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nova senha")).toBeInTheDocument();
  });

  it("renders save and close buttons", () => {
    mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    globalThis.fetch = mockFetch;

    render(<EditProfile />);
    expect(screen.getByText("Salvar")).toBeInTheDocument();
    expect(screen.getByText("Fechar")).toBeInTheDocument();
  });

  it("fetches profile on mount and pre-fills form", async () => {
    mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          name: "João Silva",
          email: "joao@email.com",
          image: "https://example.com/avatar.jpg",
          provider: "credentials",
        }),
    });
    globalThis.fetch = mockFetch;

    render(<EditProfile />);

    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText("Seu nome") as HTMLInputElement;
      expect(nameInput.value).toBe("João Silva");
    });

    const emailInput = screen.getByPlaceholderText("seu@email.com") as HTMLInputElement;
    expect(emailInput.value).toBe("joao@email.com");
  });

  it("sets isGoogleUser when provider is google", async () => {
    mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          name: "User",
          email: "user@gmail.com",
          image: null,
          provider: "google",
        }),
    });
    globalThis.fetch = mockFetch;

    render(<EditProfile />);

    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText("Seu nome") as HTMLInputElement;
      expect(nameInput.disabled).toBe(true);
    });

    expect(
      screen.getByText("Conta vinculada ao Google. Para alterar, use o Google."),
    ).toBeInTheDocument();
  });

  it("shows validation error for short name", async () => {
    mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    globalThis.fetch = mockFetch;

    render(<EditProfile />);

    const nameInput = screen.getByPlaceholderText("Seu nome");
    await userEvent.type(nameInput, "A");

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(screen.getByText("Nome deve ter pelo menos 2 caracteres")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email", async () => {
    mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    globalThis.fetch = mockFetch;

    render(<EditProfile />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    await userEvent.type(emailInput, "invalid");

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    });
  });

  it("shows validation error for short password", async () => {
    mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    globalThis.fetch = mockFetch;

    render(<EditProfile />);

    const passwordInput = screen.getByPlaceholderText("Nova senha");
    await userEvent.type(passwordInput, "123");

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(screen.getByText("A senha deve ter no mínimo 6 caracteres")).toBeInTheDocument();
    });
  });

  it("calls fetch PUT on valid submit and shows success toast", async () => {
    mockFetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            name: "João",
            email: "joao@email.com",
            image: null,
            provider: "credentials",
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ name: "João", email: "joao@email.com", image: null }),
      });
    globalThis.fetch = mockFetch;

    render(<EditProfile />);

    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText("Seu nome") as HTMLInputElement;
      expect(nameInput.value).toBe("João");
    });

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "João",
          email: "joao@email.com",
          password: "",
          image: null,
        }),
      });
    });

    expect(mockedToast.success).toHaveBeenCalledWith("Perfil atualizado com sucesso!");
  });

  it("calls toast.error on failed update", async () => {
    mockFetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            name: "João",
            email: "joao@email.com",
            image: null,
            provider: "credentials",
          }),
      })
      .mockResolvedValueOnce({ ok: false });
    globalThis.fetch = mockFetch;

    render(<EditProfile />);

    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText("Seu nome") as HTMLInputElement;
      expect(nameInput.value).toBe("João");
    });

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith("Erro ao atualizar perfil");
    });
  });

  it("avatar passes disabled prop when isGoogleUser", async () => {
    mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          name: "User",
          email: "user@gmail.com",
          image: null,
          provider: "google",
        }),
    });
    globalThis.fetch = mockFetch;

    render(<EditProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("avatar-profile")).toHaveAttribute("data-disabled", "true");
    });
  });
});
