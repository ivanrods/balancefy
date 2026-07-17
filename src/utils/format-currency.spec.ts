import { formatCurrency } from "./format-currency";

describe("formatCurrency", () => {
  it("formats with BRL and pt-BR by default", () => {
    expect(formatCurrency(1234.56)).toBe("R$ 1.234,56");
  });

  it("formats with USD and en-US", () => {
    expect(formatCurrency(1234.56, "USD", "en-US")).toBe("$1,234.56");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("R$ 0,00");
  });

  it("handles negative values", () => {
    expect(formatCurrency(-50.1)).toBe("-R$ 50,10");
  });
});
