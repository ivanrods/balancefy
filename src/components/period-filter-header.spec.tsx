import { render, screen, fireEvent } from "@testing-library/react";
import { PeriodFilterHeader } from "@/components/period-filter-header";
import * as periodContext from "@/context/period-context";

const mockSetMode = jest.fn();
const mockSetSelectedMonth = jest.fn();

jest.mock("@/context/period-context", () => ({
  PeriodProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  usePeriod: jest.fn(),
}));

jest.mock("@/hooks/use-translation", () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "period.selectPeriod": "Selecionar período",
        "period.byMonth": "Por mês",
        "period.totalPeriod": "Período total",
        "period.selectMonth": "Selecionar mês",
      };
      return translations[key] ?? key;
    },
    locale: "pt-BR" as const,
    setLocale: jest.fn(),
  })),
}));

function mockUsePeriod(overrides: Partial<ReturnType<typeof periodContext.usePeriod>> = {}) {
  const defaultMock = {
    mode: "month" as const,
    setMode: mockSetMode,
    selectedMonth: 7,
    setSelectedMonth: mockSetSelectedMonth,
  };
  (periodContext.usePeriod as jest.Mock).mockReturnValue({
    ...defaultMock,
    ...overrides,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUsePeriod();
});

describe("PeriodFilterHeader", () => {
  it("renderiza o título passado como prop", () => {
    render(<PeriodFilterHeader title="Minhas Transações" />);
    expect(screen.getByRole("heading", { name: "Minhas Transações" })).toBeInTheDocument();
  });

  it("exibe o Select de modo com valor atual Por mês", () => {
    render(<PeriodFilterHeader title="Teste" />);
    expect(screen.getByText("Por mês")).toBeInTheDocument();
  });

  it("exibe as opções Por mês e Período total ao abrir o Select de modo", () => {
    render(<PeriodFilterHeader title="Teste" />);
    const trigger = screen.getByText("Por mês");
    fireEvent.click(trigger);
    expect(screen.getByText("Período total")).toBeInTheDocument();
  });

  it("exibe o Select de mês com o mês atual", () => {
    render(<PeriodFilterHeader title="Teste" />);
    expect(screen.getByText("julho")).toBeInTheDocument();
  });

  it("exibe 12 meses ao abrir o Select de mês", () => {
    render(<PeriodFilterHeader title="Teste" />);
    const trigger = screen.getByText("julho");
    fireEvent.click(trigger);
    const months = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];
    for (const month of months) {
      const elements = screen.getAllByText(month);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("não exibe o Select de mês quando mode='total'", () => {
    mockUsePeriod({ mode: "total" });

    render(<PeriodFilterHeader title="Teste" />);
    expect(screen.queryByText("julho")).not.toBeInTheDocument();
  });

  it("chama setMode ao selecionar Período total", () => {
    render(<PeriodFilterHeader title="Teste" />);
    const trigger = screen.getByText("Por mês");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText("Período total"));
    expect(mockSetMode).toHaveBeenCalledWith("total");
  });

  it("chama setSelectedMonth ao selecionar um mês", () => {
    render(<PeriodFilterHeader title="Teste" />);
    const trigger = screen.getByText("julho");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText("março"));
    expect(mockSetSelectedMonth).toHaveBeenCalledWith(3);
  });
});
