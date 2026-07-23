import { render, screen } from "@testing-library/react";
import { SearchDialog } from "./search-dialog";
import { useTranslation } from "@/hooks/use-translation";

jest.mock("@/hooks/use-translation");

jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = "MockLink";
  return MockLink;
});

const mockSetOpen = jest.fn();

jest.mock("@/components/ui/command", () => ({
  CommandDialog: ({ children, open }: { children: React.ReactNode; open?: boolean }) =>
    open ? <div data-testid="command-dialog">{children}</div> : null,
  CommandInput: ({ placeholder }: { placeholder?: string }) => (
    <input data-testid="command-input" placeholder={placeholder} />
  ),
  CommandList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command-list">{children}</div>
  ),
  CommandEmpty: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command-empty">{children}</div>
  ),
  CommandGroup: ({ children, heading }: { children: React.ReactNode; heading?: string }) => (
    <div data-testid="command-group" data-heading={heading}>{children}</div>
  ),
  CommandItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command-item">{children}</div>
  ),
  CommandSeparator: () => <hr data-testid="command-separator" />,
  CommandShortcut: ({ children }: { children: React.ReactNode }) => (
    <kbd data-testid="command-shortcut">{children}</kbd>
  ),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUseTranslation = jest.mocked(useTranslation);

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "header.commandPlaceholder": "Pesquisar...",
        "header.noResults": "Nenhum resultado encontrado.",
        "header.suggestions": "Sugestões",
        "header.settings": "Configurações",
        "header.profile": "Perfil",
        "sidebar.wallet": "Carteira",
        "sidebar.categories": "Categorias",
        "sidebar.reports": "Relatórios",
        "sidebar.help": "Ajuda",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });
});

describe("SearchDialog", () => {
  it("renders nothing when open is false", () => {
    const { container } = render(
      <SearchDialog open={false} setOpen={mockSetOpen} />,
    );
    expect(container.querySelector('[data-testid="command-dialog"]')).toBeNull();
  });

  it("renders dialog when open is true", () => {
    render(<SearchDialog open setOpen={mockSetOpen} />);
    expect(screen.getByTestId("command-dialog")).toBeInTheDocument();
  });

  it("renders command input with placeholder", () => {
    render(<SearchDialog open setOpen={mockSetOpen} />);
    const input = screen.getByTestId("command-input");
    expect(input).toHaveAttribute("placeholder", "Pesquisar...");
  });

  it("renders empty state message", () => {
    render(<SearchDialog open setOpen={mockSetOpen} />);
    expect(
      screen.getByText("Nenhum resultado encontrado."),
    ).toBeInTheDocument();
  });

  it("renders suggestions group with heading", () => {
    render(<SearchDialog open setOpen={mockSetOpen} />);
    const groups = screen.getAllByTestId("command-group");
    expect(groups[0]).toHaveAttribute("data-heading", "Sugestões");
  });

  it("renders settings group with heading", () => {
    render(<SearchDialog open setOpen={mockSetOpen} />);
    const groups = screen.getAllByTestId("command-group");
    expect(groups[1]).toHaveAttribute("data-heading", "Configurações");
  });

  it("renders suggestion links with correct hrefs", () => {
    render(<SearchDialog open setOpen={mockSetOpen} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);

    expect(links[0]).toHaveAttribute("href", "wallet");
    expect(links[1]).toHaveAttribute("href", "categories");
    expect(links[2]).toHaveAttribute("href", "reports");
    expect(links[3]).toHaveAttribute("href", "help");
  });

  it("renders suggestion link labels", () => {
    render(<SearchDialog open setOpen={mockSetOpen} />);

    expect(screen.getByText("Carteira")).toBeInTheDocument();
    expect(screen.getByText("Categorias")).toBeInTheDocument();
    expect(screen.getByText("Relatórios")).toBeInTheDocument();
    expect(screen.getByText("Ajuda")).toBeInTheDocument();
  });

  it("renders profile and settings items", () => {
    render(<SearchDialog open setOpen={mockSetOpen} />);

    expect(screen.getByText("Perfil")).toBeInTheDocument();
    expect(screen.getByText("Configurações")).toBeInTheDocument();
  });

  it("renders keyboard shortcuts", () => {
    render(<SearchDialog open setOpen={mockSetOpen} />);

    const shortcuts = screen.getAllByTestId("command-shortcut");
    expect(shortcuts).toHaveLength(2);
    expect(shortcuts[0]).toHaveTextContent("⌘P");
    expect(shortcuts[1]).toHaveTextContent("⌘S");
  });

  it("renders separator between groups", () => {
    render(<SearchDialog open setOpen={mockSetOpen} />);
    const separators = screen.getAllByTestId("command-separator");
    expect(separators).toHaveLength(1);
  });
});
