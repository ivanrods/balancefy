import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./theme-context";

function TestConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button data-testid="toggle" onClick={toggleTheme}>
        toggle
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <TestConsumer />
    </ThemeProvider>,
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("provides default theme as light", () => {
    renderWithProvider();
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("toggles theme from light to dark", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("toggles theme from dark to light", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("toggle"));
    fireEvent.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("persists theme to localStorage", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("toggle"));
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("loads theme from localStorage", () => {
    localStorage.setItem("theme", "dark");
    renderWithProvider();
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("toggles dark class on documentElement", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("toggle"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class when toggled back to light", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("toggle"));
    fireEvent.click(screen.getByTestId("toggle"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

describe("useTheme", () => {
  it("throws when used outside ThemeProvider", () => {
    expect(() => render(<TestConsumer />)).toThrow("useTheme must be used within a ThemeProvider");
  });
});
