import { render, screen, fireEvent } from "@testing-library/react";
import { DrawerConfig } from "./drawer-config";
import { useTranslation } from "@/hooks/use-translation";
import { useCurrency } from "@/context/currency-context";
import { useLocale } from "@/context/locale-context";

jest.mock("@/hooks/use-translation");
jest.mock("@/context/currency-context");
jest.mock("@/context/locale-context");

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-item">{children}</div>
  ),
}));

jest.mock("@/components/ui/drawer", () => ({
  Drawer: ({ children }: { children: React.ReactNode }) => <div data-testid="drawer">{children}</div>,
  DrawerTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-trigger">{children}</div>
  ),
  DrawerContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-content">{children}</div>
  ),
  DrawerHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  DrawerDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DrawerFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerClose: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUseTranslation = jest.mocked(useTranslation);
const mockedUseCurrency = jest.mocked(useCurrency);
const mockedUseLocale = jest.mocked(useLocale);

const mockSetCurrency = jest.fn();
const mockSetLocale = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "nav.settings": "Configurações",
        "config.title": "Configurações",
        "config.description": "Personalize suas preferências.",
        "config.currency": "Moeda",
        "config.language": "Idioma",
        "config.portuguese": "Português",
        "config.english": "Inglês",
        "config.save": "Salvar",
        "config.cancel": "Cancelar",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedUseCurrency.mockReturnValue({
    currency: "BRL",
    setCurrency: mockSetCurrency,
  });

  mockedUseLocale.mockReturnValue({
    locale: "pt-BR",
    setLocale: mockSetLocale,
  });
});

describe("DrawerConfig", () => {
  it("renders trigger", () => {
    render(<DrawerConfig />);
    const texts = screen.getAllByText("Configurações");
    expect(texts).toHaveLength(2);
  });

  it("renders drawer title and description", () => {
    render(<DrawerConfig />);
    expect(screen.getByText("Personalize suas preferências.")).toBeInTheDocument();
  });

  it("renders currency and language labels", () => {
    render(<DrawerConfig />);
    expect(screen.getByText("Moeda")).toBeInTheDocument();
    expect(screen.getByText("Idioma")).toBeInTheDocument();
  });

  it("shows BRL and USD buttons", () => {
    render(<DrawerConfig />);
    expect(screen.getByText("BRL (R$)")).toBeInTheDocument();
    expect(screen.getByText("USD ($)")).toBeInTheDocument();
  });

  it("shows Portuguese and English buttons", () => {
    render(<DrawerConfig />);
    expect(screen.getByText("Português")).toBeInTheDocument();
    expect(screen.getByText("Inglês")).toBeInTheDocument();
  });

  it("calls setCurrency when USD is selected and save is clicked", () => {
    render(<DrawerConfig />);

    fireEvent.click(screen.getByText("USD ($)"));
    fireEvent.click(screen.getByText("Salvar"));

    expect(mockSetCurrency).toHaveBeenCalledWith("USD");
  });

  it("calls setLocale when English is selected and locale differs", () => {
    render(<DrawerConfig />);

    fireEvent.click(screen.getByText("Inglês"));
    fireEvent.click(screen.getByText("Salvar"));

    expect(mockSetLocale).toHaveBeenCalledWith("en");
  });

  it("does not call setLocale when locale is unchanged", () => {
    render(<DrawerConfig />);

    fireEvent.click(screen.getByText("USD ($)"));
    fireEvent.click(screen.getByText("Salvar"));

    expect(mockSetCurrency).toHaveBeenCalledWith("USD");
    expect(mockSetLocale).not.toHaveBeenCalled();
  });

  it("renders save and cancel buttons", () => {
    render(<DrawerConfig />);
    expect(screen.getByText("Salvar")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("highlights BRL as default currency button", () => {
    render(<DrawerConfig />);
    const brlButton = screen.getByText("BRL (R$)");
    const usdButton = screen.getByText("USD ($)");

    expect(brlButton.className).toContain("bg-primary");
    expect(usdButton.className).toContain("border");
  });

  it("highlights Portuguese as default locale button", () => {
    render(<DrawerConfig />);
    const ptButton = screen.getByText("Português");
    const enButton = screen.getByText("Inglês");

    expect(ptButton.className).toContain("bg-primary");
    expect(enButton.className).toContain("border");
  });
});
