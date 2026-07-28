import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DeleteCategoriesDialog } from "./delete-categories-dialog";
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
        "category.deleteTitle": "Excluir Categoria",
        "category.deleteDescription": "Tem certeza que deseja excluir esta categoria?",
        "category.deleted": "Categoria excluída com sucesso!",
        "category.deleteError": "Erro ao excluir categoria",
        "category.cancel": "Cancelar",
        "category.deleteConfirm": "Excluir",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedUseCategoriesMutations.mockReturnValue({
    deleteCategory: { mutate: mockMutate },
    createCategory: { mutate: jest.fn() },
    updateCategory: { mutate: jest.fn() },
  } as unknown as ReturnType<typeof useCategoriesMutations>);

  mockedToast.success = jest.fn();
  mockedToast.error = jest.fn();
});

function getTrigger() {
  return screen.getByText("Excluir Categoria");
}

describe("DeleteCategoriesDialog", () => {
  it("renders trigger", () => {
    render(<DeleteCategoriesDialog id="cat-1" />);
    expect(getTrigger()).toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", () => {
    render(<DeleteCategoriesDialog id="cat-1" />);
    fireEvent.click(getTrigger());
    expect(screen.getByText("Tem certeza que deseja excluir esta categoria?")).toBeInTheDocument();
  });

  it("calls deleteCategory.mutate with id on confirm", async () => {
    render(<DeleteCategoriesDialog id="cat-1" />);
    fireEvent.click(getTrigger());

    const deleteButton = screen.getByText("Excluir");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    expect(mockMutate).toHaveBeenCalledWith("cat-1", expect.any(Object));
  });

  it("calls toast.success on successful mutation", async () => {
    mockMutate.mockImplementation((_id, { onSuccess }) => {
      onSuccess();
    });

    render(<DeleteCategoriesDialog id="cat-1" />);
    fireEvent.click(getTrigger());

    const deleteButton = screen.getByText("Excluir");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith("Categoria excluída com sucesso!");
    });
  });

  it("calls toast.error on failed mutation", async () => {
    mockMutate.mockImplementation((_id, { onError }) => {
      onError();
    });

    render(<DeleteCategoriesDialog id="cat-1" />);
    fireEvent.click(getTrigger());

    const deleteButton = screen.getByText("Excluir");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith("Erro ao excluir categoria");
    });
  });

  it("closes dialog on cancel", () => {
    render(<DeleteCategoriesDialog id="cat-1" />);
    fireEvent.click(getTrigger());

    expect(screen.getByText("Tem certeza que deseja excluir esta categoria?")).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(
      screen.queryByText("Tem certeza que deseja excluir esta categoria?"),
    ).not.toBeInTheDocument();
  });
});
