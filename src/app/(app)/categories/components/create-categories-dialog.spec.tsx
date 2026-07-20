import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoriesDialog } from "./create-categories-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { useCategoriesMutations } from "@/hooks/use-categories";
import { toast } from "sonner";

jest.mock("@/hooks/use-translation");
jest.mock("@/hooks/use-categories");
jest.mock("sonner");

jest.mock("./slider-color", () => ({
  SliderColor: ({ value, onValueChange }: { value: string; onValueChange: (v: string) => void }) => (
    <input
      data-testid="color-picker"
      type="color"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUseTranslation = jest.mocked(useTranslation);
const mockedUseCategoriesMutations = jest.mocked(useCategoriesMutations);
const mockedToast = jest.mocked(toast);

const mockMutate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "category.newCategory": "Nova Categoria",
        "category.addTitle": "Adicionar Categoria",
        "category.addDescription": "Preencha o nome e escolha uma cor.",
        "category.name": "Nome",
        "category.color": "Cor",
        "category.save": "Adicionar",
        "category.cancel": "Cancelar",
        "category.success": "Categoria criada com sucesso!",
        "category.error": "Erro ao criar categoria",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedUseCategoriesMutations.mockReturnValue({
    createCategory: { mutate: mockMutate },
  } as unknown as ReturnType<typeof useCategoriesMutations>);

  mockedToast.success = jest.fn();
  mockedToast.error = jest.fn();
});

function getTrigger() {
  return screen.getByRole("button", { name: /Nova Categoria/i });
}

function openDialog() {
  fireEvent.click(getTrigger());
}

describe("CategoriesDialog", () => {
  it("renders trigger button", () => {
    render(<CategoriesDialog />);
    expect(getTrigger()).toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", () => {
    render(<CategoriesDialog />);
    openDialog();
    expect(screen.getByText("Adicionar Categoria")).toBeInTheDocument();
  });

  it("displays name input and color picker", () => {
    render(<CategoriesDialog />);
    openDialog();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByTestId("color-picker")).toBeInTheDocument();
  });

  it("calls createCategory.mutate on valid submit", async () => {
    render(<CategoriesDialog />);
    openDialog();

    await userEvent.type(screen.getByRole("textbox"), "Alimentação");
    fireEvent.change(screen.getByTestId("color-picker"), {
      target: { value: "#ff0000" },
    });

    const saveButton = screen.getByRole("button", { name: /Adicionar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    const callArg = mockMutate.mock.calls[0][0];
    expect(callArg.name).toBe("Alimentação");
    expect(callArg.color).toBe("#ff0000");
  });

  it("shows validation error for short name", async () => {
    render(<CategoriesDialog />);
    openDialog();

    await userEvent.type(screen.getByRole("textbox"), "ab");

    const saveButton = screen.getByRole("button", { name: /Adicionar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("O nome da categoria deve ter pelo menos 3 caracteres"),
      ).toBeInTheDocument();
    });
  });

  it("calls toast.success on successful mutation", async () => {
    mockMutate.mockImplementation((_data, { onSuccess }) => {
      onSuccess();
    });

    render(<CategoriesDialog />);
    openDialog();

    await userEvent.type(screen.getByRole("textbox"), "Alimentação");

    const saveButton = screen.getByRole("button", { name: /Adicionar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith(
        "Categoria criada com sucesso!",
      );
    });
  });

  it("calls toast.error on failed mutation", async () => {
    mockMutate.mockImplementation((_data, { onError }) => {
      onError();
    });

    render(<CategoriesDialog />);
    openDialog();

    await userEvent.type(screen.getByRole("textbox"), "Alimentação");

    const saveButton = screen.getByRole("button", { name: /Adicionar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith(
        "Erro ao criar categoria",
      );
    });
  });

  it("closes dialog on cancel", () => {
    render(<CategoriesDialog />);
    openDialog();
    expect(screen.getByText("Adicionar Categoria")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelButton);

    expect(
      screen.queryByText("Adicionar Categoria"),
    ).not.toBeInTheDocument();
  });

  it("resets form after successful creation", async () => {
    mockMutate.mockImplementation((_data, { onSuccess }) => {
      onSuccess();
    });

    render(<CategoriesDialog />);
    openDialog();

    await userEvent.type(screen.getByRole("textbox"), "Alimentação");

    const saveButton = screen.getByRole("button", { name: /Adicionar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("");
    });
  });
});
