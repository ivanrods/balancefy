import { render, screen, fireEvent } from "@testing-library/react";
import { LocaleProvider, useLocale } from "./locale-context";

function TestConsumer() {
  const { locale, setLocale } = useLocale();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button data-testid="set-en" onClick={() => setLocale("en")}>
        set en
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <LocaleProvider>
      <TestConsumer />
    </LocaleProvider>,
  );
}

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("LocaleProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "locale=;path=/;max-age=0";
  });

  it("provides default locale as pt-BR", () => {
    renderWithProvider();
    expect(screen.getByTestId("locale")).toHaveTextContent("pt-BR");
  });

  it("loads locale from localStorage after mount", () => {
    localStorage.setItem("locale", "en");
    renderWithProvider();
    expect(screen.getByTestId("locale")).toHaveTextContent("en");
  });

  it("saves locale to localStorage on setLocale", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("set-en"));
    expect(localStorage.getItem("locale")).toBe("en");
  });

  it("sets cookie on setLocale", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("set-en"));
    expect(document.cookie).toContain("locale=en");
  });
});

describe("useLocale", () => {
  it("throws when used outside LocaleProvider", () => {
    expect(() => render(<TestConsumer />)).toThrow(
      "useLocale must be used within LocaleProvider",
    );
  });
});
