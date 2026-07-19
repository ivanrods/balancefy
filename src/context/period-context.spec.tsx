import { render, screen, fireEvent } from "@testing-library/react";
import { PeriodProvider, usePeriod } from "./period-context";

function TestConsumer() {
  const { mode, setMode, selectedMonth, setSelectedMonth } = usePeriod();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="selected-month">{selectedMonth}</span>
      <button data-testid="set-mode-total" onClick={() => setMode("total")}>
        set total
      </button>
      <button data-testid="set-month-3" onClick={() => setSelectedMonth(3)}>
        set month 3
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <PeriodProvider>
      <TestConsumer />
    </PeriodProvider>,
  );
}

describe("PeriodProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides default mode as month", () => {
    renderWithProvider();
    expect(screen.getByTestId("mode")).toHaveTextContent("month");
  });

  it("provides default selectedMonth as current month", () => {
    renderWithProvider();
    const month = new Date().getMonth() + 1;
    expect(screen.getByTestId("selected-month")).toHaveTextContent(String(month));
  });

  it("updates mode via setMode", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("set-mode-total"));
    expect(screen.getByTestId("mode")).toHaveTextContent("total");
  });

  it("updates selectedMonth via setSelectedMonth", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("set-month-3"));
    expect(screen.getByTestId("selected-month")).toHaveTextContent("3");
  });

  it("persists mode to localStorage", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("set-mode-total"));
    expect(localStorage.getItem("period-mode")).toBe("total");
  });

  it("persists selectedMonth to localStorage", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("set-month-3"));
    expect(localStorage.getItem("period-selected-month")).toBe("3");
  });

  it("loads mode from localStorage", () => {
    localStorage.setItem("period-mode", "total");
    renderWithProvider();
    expect(screen.getByTestId("mode")).toHaveTextContent("total");
  });

  it("loads selectedMonth from localStorage", () => {
    localStorage.setItem("period-selected-month", "7");
    renderWithProvider();
    expect(screen.getByTestId("selected-month")).toHaveTextContent("7");
  });

  it("ignores invalid localStorage mode", () => {
    localStorage.setItem("period-mode", "invalid");
    renderWithProvider();
    expect(screen.getByTestId("mode")).toHaveTextContent("month");
  });

  it("ignores invalid localStorage month", () => {
    localStorage.setItem("period-selected-month", "99");
    renderWithProvider();
    const month = new Date().getMonth() + 1;
    expect(screen.getByTestId("selected-month")).toHaveTextContent(String(month));
  });
});

describe("usePeriod", () => {
  it("throws when used outside PeriodProvider", () => {
    expect(() => render(<TestConsumer />)).toThrow(
      "usePeriod deve ser usado dentro de um PeriodProvider",
    );
  });
});
