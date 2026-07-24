import { render, screen } from "@testing-library/react";
import CategoriesPage, { generateMetadata } from "./page";

const mockGetServerTranslations = jest.fn();
const mockGetServerSession = jest.fn();
const mockGetCategoriesSummary = jest.fn();

jest.mock("@/lib/locale", () => ({
  getServerTranslations: () => mockGetServerTranslations(),
}));

jest.mock("next-auth", () => ({
  getServerSession: () => mockGetServerSession(),
}));

jest.mock("@/lib/auth-options", () => ({
  authOptions: {},
}));

jest.mock("@/lib/services/category-service", () => ({
  getCategoriesSummary: (...args: unknown[]) => mockGetCategoriesSummary(...args),
}));

jest.mock("@/components/period-filter-header", () => ({
  __esModule: true,
  PeriodFilterHeader: ({ title }: { title: string }) => (
    <div data-testid="period-filter-header">{title}</div>
  ),
}));

jest.mock("./components/categories-table", () => ({
  __esModule: true,
  CategoriesDataTable: ({ initialCategories }: { initialCategories: unknown }) => (
    <div data-testid="categories-data-table" data-has-categories={initialCategories !== undefined ? "true" : "false"} />
  ),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockGetServerTranslations.mockResolvedValue((key: string) => {
    const map: Record<string, string> = {
      "meta.categories.title": "Categorias",
      "meta.categories.description": "Descricao categorias",
      "sidebar.categories": "Categorias",
    };
    return map[key] ?? key;
  });
});

describe("CategoriesPage", () => {
  it("renderiza titulo no PeriodFilterHeader", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetCategoriesSummary.mockResolvedValue([]);

    const page = await CategoriesPage();
    render(page);

    expect(screen.getByTestId("period-filter-header")).toHaveTextContent("Categorias");
  });

  it("renderiza container com classes CSS corretas", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetCategoriesSummary.mockResolvedValue([]);

    const page = await CategoriesPage();
    const { container } = render(page);

    expect(container.firstChild).toHaveClass("w-full", "flex", "flex-col", "gap-4");
  });

  it("renderiza CategoriesDataTable com undefined quando usuario nao autenticado", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetCategoriesSummary.mockResolvedValue([]);

    const page = await CategoriesPage();
    render(page);

    expect(screen.getByTestId("categories-data-table")).toHaveAttribute("data-has-categories", "false");
  });

  it("renderiza CategoriesDataTable com categorias quando usuario autenticado", async () => {
    const mockCategories = [
      {
        id: "c1",
        name: "Alimentacao",
        color: "#FF5733",
        userId: "u1",
        _count: { transactions: 5 },
        _sum: { value: 1200 },
      },
    ];

    mockGetServerSession.mockResolvedValue({ user: { id: "u1" } });
    mockGetCategoriesSummary.mockResolvedValue(mockCategories);

    const page = await CategoriesPage();
    render(page);

    expect(screen.getByTestId("categories-data-table")).toHaveAttribute("data-has-categories", "true");
    expect(mockGetCategoriesSummary).toHaveBeenCalledWith({ userId: "u1" });
  });

  it("nao chama getCategoriesSummary quando usuario nao tem id", async () => {
    mockGetServerSession.mockResolvedValue({ user: {} });
    mockGetCategoriesSummary.mockResolvedValue([]);

    const page = await CategoriesPage();
    render(page);

    expect(mockGetCategoriesSummary).not.toHaveBeenCalled();
  });

  it("chama getCategoriesSummary com userId correto", async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: "user-123" } });
    mockGetCategoriesSummary.mockResolvedValue([]);

    await CategoriesPage();

    expect(mockGetCategoriesSummary).toHaveBeenCalledWith({ userId: "user-123" });
  });

  it("renderiza ambos componentes filhos", async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockGetCategoriesSummary.mockResolvedValue([]);

    const page = await CategoriesPage();
    render(page);

    expect(screen.getByTestId("period-filter-header")).toBeInTheDocument();
    expect(screen.getByTestId("categories-data-table")).toBeInTheDocument();
  });
});

describe("generateMetadata", () => {
  it("retorna metadados das categorias", async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: "Categorias",
      description: "Descricao categorias",
    });
  });

  it("retorna titulo e description como strings", async () => {
    const metadata = await generateMetadata();

    expect(typeof metadata.title).toBe("string");
    expect(typeof metadata.description).toBe("string");
  });

  it("chama getServerTranslations", async () => {
    await generateMetadata();

    expect(mockGetServerTranslations).toHaveBeenCalled();
  });
});
