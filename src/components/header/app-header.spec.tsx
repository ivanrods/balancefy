import { render, screen } from "@testing-library/react";
import { AppHeader } from "./app-header";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@/hooks/use-translation");

jest.mock("../ui/sidebar", () => ({
  SidebarTrigger: () => <div data-testid="sidebar-trigger" />,
}));

jest.mock("./components/dynamic-breadcrumb", () => ({
  __esModule: true,
  default: () => <div data-testid="dynamic-breadcrumb" />,
}));

jest.mock("./components/input-search", () => ({
  InputSearch: () => <div data-testid="input-search" />,
}));

jest.mock("./components/notifications", () => ({
  Notifications: () => <div data-testid="notifications" />,
}));

jest.mock("./components/button-theme", () => ({
  ButtonTheme: () => <div data-testid="button-theme" />,
}));

jest.mock(
  "@/app/(app)/categories/components/create-categories-dialog",
  () => ({
    CategoriesDialog: () => <div data-testid="categories-dialog" />,
  }),
);

jest.mock("@/app/(app)/wallet/components/create-wallet-dialog", () => ({
  WalletDialog: () => <div data-testid="wallet-dialog" />,
}));

jest.mock(
  "@/app/(app)/transactions/components/create-transaction-dialog",
  () => ({
    TransactionDialog: () => <div data-testid="transaction-dialog" />,
  }),
);

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUsePathname = jest.mocked(usePathname);
const mockedUseTranslation = jest.mocked(useTranslation);

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => key,
    locale: "pt-BR",
    setLocale: jest.fn(),
  });
});

describe("AppHeader", () => {
  it("renders sidebar trigger and breadcrumb always", () => {
    mockedUsePathname.mockReturnValue("/dashboard");
    render(<AppHeader />);

    expect(screen.getByTestId("sidebar-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("dynamic-breadcrumb")).toBeInTheDocument();
  });

  it("renders theme button and notifications always", () => {
    mockedUsePathname.mockReturnValue("/dashboard");
    render(<AppHeader />);

    expect(screen.getByTestId("button-theme")).toBeInTheDocument();
    expect(screen.getByTestId("notifications")).toBeInTheDocument();
  });

  it("shows InputSearch and TransactionDialog on /transactions", () => {
    mockedUsePathname.mockReturnValue("/transactions");
    render(<AppHeader />);

    expect(screen.getByTestId("input-search")).toBeInTheDocument();
    expect(screen.getByTestId("transaction-dialog")).toBeInTheDocument();
  });

  it("shows InputSearch and TransactionDialog on /dashboard", () => {
    mockedUsePathname.mockReturnValue("/dashboard");
    render(<AppHeader />);

    expect(screen.getByTestId("input-search")).toBeInTheDocument();
    expect(screen.getByTestId("transaction-dialog")).toBeInTheDocument();
  });

  it("hides InputSearch and TransactionDialog on other paths", () => {
    mockedUsePathname.mockReturnValue("/categories");
    render(<AppHeader />);

    expect(screen.queryByTestId("input-search")).not.toBeInTheDocument();
    expect(screen.queryByTestId("transaction-dialog")).not.toBeInTheDocument();
  });

  it("shows CategoriesDialog on /categories", () => {
    mockedUsePathname.mockReturnValue("/categories");
    render(<AppHeader />);

    expect(screen.getByTestId("categories-dialog")).toBeInTheDocument();
    expect(screen.queryByTestId("wallet-dialog")).not.toBeInTheDocument();
  });

  it("shows WalletDialog on /wallet", () => {
    mockedUsePathname.mockReturnValue("/wallet");
    render(<AppHeader />);

    expect(screen.getByTestId("wallet-dialog")).toBeInTheDocument();
    expect(screen.queryByTestId("categories-dialog")).not.toBeInTheDocument();
  });

  it("passes initialNotifications to Notifications", () => {
    mockedUsePathname.mockReturnValue("/dashboard");
    const notifications = [{ id: "n1", message: "Test", read: false }] as never[];

    render(<AppHeader initialNotifications={notifications} />);
    expect(screen.getByTestId("notifications")).toBeInTheDocument();
  });
});
