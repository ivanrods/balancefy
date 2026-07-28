import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditCategoriesDialog } from "./edit-categories-dialog";
import { Categories } from "@/types/categories";
import { useTranslation } from "@/hooks/use-translation";
import { useCategoriesMutations } from "@/hooks/use-categories";
import { toast } from "sonner";

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
  }) => (
    <button type="button" data-testid="dialog-trigger" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock("@/hooks/use-translation");
jest.mock("@/hooks/use-categories");
jest.mock("sonner");

jest.mock("./slider-color", () => ({
  SliderColor: ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (v: string) => void;
  }) => (
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

const defaultCategory: Categories = {
  id: "cat-1",
  name: "Alimentação",
  color: "#ff0000",
  relationship: [],
  value: 0,
  number: 0,
};

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "category.editTitle": "Editar Categoria",
        "category.editDescription": "Altere o nome ou a cor da categoria.",
        "category.name": "Nome",
        "category.color": "Cor",
        "category.save": "Salvar",
        "category.cancel": "Cancelar",
        "category.editSuccess": "Categoria atualizada com sucesso!",
        "category.editError": "Erro ao atualizar categoria",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedUseCategoriesMutations.mockReturnValue({
    updateCategory: { mutate: mockMutate },
    createCategory: { mutate: jest.fn() },
    deleteCategory: { mutate: jest.fn() },
  } as unknown as ReturnType<typeof useCategoriesMutations>);

  mockedToast.success = jest.fn();
  mockedToast.error = jest.fn();
});

function getTrigger() {
  return screen.getByText("Editar Categoria");
}

describe("EditCategoriesDialog", () => {
  it("renders trigger", () => {
    render(<EditCategoriesDialog categories={defaultCategory} />);
    expect(getTrigger()).toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", () => {
    render(<EditCategoriesDialog categories={defaultCategory} />);
    fireEvent.click(getTrigger());
    expect(screen.getByText("Altere o nome ou a cor da categoria.")).toBeInTheDocument();
  });

  it("pre-fills form with category data", () => {
    render(<EditCategoriesDialog categories={defaultCategory} />);
    fireEvent.click(getTrigger());

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("Alimentação");

    const colorPicker = screen.getByTestId("color-picker") as HTMLInputElement;
    expect(colorPicker.value).toBe("#ff0000");
  });

  it("calls updateCategory.mutate on valid submit", async () => {
    render(<EditCategoriesDialog categories={defaultCategory} />);
    fireEvent.click(getTrigger());

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Mercado" } });
    fireEvent.change(screen.getByTestId("color-picker"), {
      target: { value: "#00ff00" },
    });

    const saveButton = screen.getByRole("button", { name: /Salvar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    const callArg = mockMutate.mock.calls[0][0];
    expect(callArg.id).toBe("cat-1");
    expect(callArg.name).toBe("Mercado");
    expect(callArg.color).toBe("#00ff00");
  });

  it("calls toast.success on successful mutation", async () => {
    mockMutate.mockImplementation((_data, { onSuccess }) => {
      onSuccess();
    });

    render(<EditCategoriesDialog categories={defaultCategory} />);
    fireEvent.click(getTrigger());

    const saveButton = screen.getByRole("button", { name: /Salvar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith("Categoria atualizada com sucesso!");
    });
  });

  it("calls toast.error on failed mutation", async () => {
    mockMutate.mockImplementation((_data, { onError }) => {
      onError();
    });

    render(<EditCategoriesDialog categories={defaultCategory} />);
    fireEvent.click(getTrigger());

    const saveButton = screen.getByRole("button", { name: /Salvar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith("Erro ao atualizar categoria");
    });
  });

  it("shows validation error for short name", async () => {
    render(<EditCategoriesDialog categories={defaultCategory} />);
    fireEvent.click(getTrigger());

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "ab" } });

    const saveButton = screen.getByRole("button", { name: /Salvar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("O nome da categoria deve ter pelo menos 3 caracteres"),
      ).toBeInTheDocument();
    });
  });

  it("closes dialog on cancel", () => {
    render(<EditCategoriesDialog categories={defaultCategory} />);
    fireEvent.click(getTrigger());

    expect(screen.getByText("Altere o nome ou a cor da categoria.")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByText("Altere o nome ou a cor da categoria.")).not.toBeInTheDocument();
  });
});
