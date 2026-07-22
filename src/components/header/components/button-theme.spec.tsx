import { render, screen, fireEvent } from "@testing-library/react";
import { ButtonTheme } from "./button-theme";
import { useTheme } from "@/context/theme-context";

jest.mock("@/context/theme-context");

jest.mock("@/components/ui/switch", () => ({
  Switch: ({ checked, onCheckedChange }: { checked?: boolean; onCheckedChange?: (v: boolean) => void }) => (
    <button
      data-testid="switch"
      data-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
    />
  ),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUseTheme = jest.mocked(useTheme);
const mockToggleTheme = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ButtonTheme", () => {
  it("renders switch", () => {
    mockedUseTheme.mockReturnValue({
      theme: "light",
      toggleTheme: mockToggleTheme,
    });

    render(<ButtonTheme />);
    expect(screen.getByTestId("switch")).toBeInTheDocument();
  });

  it("calls toggleTheme when switch is clicked", () => {
    mockedUseTheme.mockReturnValue({
      theme: "light",
      toggleTheme: mockToggleTheme,
    });

    render(<ButtonTheme />);

    fireEvent.click(screen.getByTestId("switch"));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("passes checked=true when theme is dark", () => {
    mockedUseTheme.mockReturnValue({
      theme: "dark",
      toggleTheme: mockToggleTheme,
    });

    render(<ButtonTheme />);
    expect(screen.getByTestId("switch")).toHaveAttribute(
      "data-checked",
      "true",
    );
  });

  it("passes checked=false when theme is light", () => {
    mockedUseTheme.mockReturnValue({
      theme: "light",
      toggleTheme: mockToggleTheme,
    });

    render(<ButtonTheme />);
    expect(screen.getByTestId("switch")).toHaveAttribute(
      "data-checked",
      "false",
    );
  });
});
