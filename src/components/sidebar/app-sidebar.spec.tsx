import { render, screen } from "@testing-library/react";
import { AppSidebar } from "./app-sidebar";

jest.mock("./components/nav-user", () => ({
  NavUser: () => <div data-testid="nav-user" />,
}));

jest.mock("@/lib/locale", () => ({
  getServerTranslations: jest.fn(),
}));

jest.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="sidebar" className={className}>
      {children}
    </div>
  ),
  SidebarHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-header">{children}</div>
  ),
  SidebarContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="sidebar-content" className={className}>
      {children}
    </div>
  ),
  SidebarGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-group">{children}</div>
  ),
  SidebarGroupContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-group-content">{children}</div>
  ),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu">{children}</div>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu-item">{children}</div>
  ),
  SidebarMenuButton: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="sidebar-menu-button" className={className}>
      {children}
    </div>
  ),
  SidebarFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-footer">{children}</div>
  ),
  SidebarRail: () => <div data-testid="sidebar-rail" />,
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedGetServerTranslations = jest.mocked(
  jest.requireMock("@/lib/locale").getServerTranslations,
);

beforeEach(() => {
  jest.clearAllMocks();

  mockedGetServerTranslations.mockResolvedValue((key: string) => {
    const map: Record<string, string> = {
      "sidebar.dashboard": "Dashboard",
      "sidebar.wallet": "Carteira",
      "sidebar.transactions": "Transações",
      "sidebar.categories": "Categorias",
      "sidebar.reports": "Relatórios",
      "sidebar.help": "Ajuda",
    };
    return map[key] ?? key;
  });
});

describe("AppSidebar", () => {
  it("renders sidebar structure", async () => {
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-header")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-footer")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-rail")).toBeInTheDocument();
  });

  it("renders app logo and name", async () => {
    render(await AppSidebar());
    expect(screen.getByText("Balancefy")).toBeInTheDocument();
  });

  it("renders NavUser in footer", async () => {
    render(await AppSidebar());
    expect(screen.getByTestId("nav-user")).toBeInTheDocument();
  });

  it("renders navigation items with translated titles", async () => {
    render(await AppSidebar());

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Carteira")).toBeInTheDocument();
    expect(screen.getByText("Transações")).toBeInTheDocument();
    expect(screen.getByText("Categorias")).toBeInTheDocument();
    expect(screen.getByText("Relatórios")).toBeInTheDocument();
    expect(screen.getByText("Ajuda")).toBeInTheDocument();
  });

  it("renders all nav items as links with correct hrefs", async () => {
    render(await AppSidebar());

    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));

    expect(hrefs).toContain("dashboard");
    expect(hrefs).toContain("wallet");
    expect(hrefs).toContain("transactions");
    expect(hrefs).toContain("categories");
    expect(hrefs).toContain("reports");
    expect(hrefs).toContain("help");
  });

  it("calls getServerTranslations to get translations", async () => {
    await AppSidebar();
    expect(mockedGetServerTranslations).toHaveBeenCalledTimes(1);
  });
});
