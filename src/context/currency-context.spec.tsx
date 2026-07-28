import { render, screen, fireEvent } from "@testing-library/react";
import { CurrencyProvider, useCurrency } from "./currency-context";

function TestConsumer() {
  const { currency, setCurrency } = useCurrency();
  return (
    <div>
      <span data-testid="currency">{currency}</span>
      <button data-testid="set-usd" onClick={() => setCurrency("USD")}>
        set USD
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <CurrencyProvider>
      <TestConsumer />
    </CurrencyProvider>,
  );
}

describe("CurrencyProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides default currency as BRL", () => {
    renderWithProvider();
    expect(screen.getByTestId("currency")).toHaveTextContent("BRL");
  });

  it("updates currency via setCurrency", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("set-usd"));
    expect(screen.getByTestId("currency")).toHaveTextContent("USD");
  });

  it("persists currency to localStorage", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("set-usd"));
    expect(localStorage.getItem("currency")).toBe("USD");
  });

  it("loads currency from localStorage", () => {
    localStorage.setItem("currency", "USD");
    renderWithProvider();
    expect(screen.getByTestId("currency")).toHaveTextContent("USD");
  });
});

describe("useCurrency", () => {
  it("throws when used outside CurrencyProvider", () => {
    expect(() => render(<TestConsumer />)).toThrow(
      "useCurrency must be used within CurrencyProvider",
    );
  });
});
