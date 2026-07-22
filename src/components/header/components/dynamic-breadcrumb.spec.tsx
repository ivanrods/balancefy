import { render, screen } from "@testing-library/react";
import DynamicBreadcrumb from "./dynamic-breadcrumb";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = "MockLink";
  return MockLink;
});

jest.mock("@/components/ui/breadcrumb", () => ({
  Breadcrumb: ({ children }: { children: React.ReactNode }) => (
    <nav data-testid="breadcrumb">{children}</nav>
  ),
  BreadcrumbList: ({ children }: { children: React.ReactNode }) => (
    <ol data-testid="breadcrumb-list">{children}</ol>
  ),
  BreadcrumbItem: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="breadcrumb-item">{children}</li>
  ),
  BreadcrumbLink: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="breadcrumb-link">{children}</span>
  ),
  BreadcrumbSeparator: () => (
    <span data-testid="breadcrumb-separator">/</span>
  ),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUsePathname = jest.mocked(usePathname);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("DynamicBreadcrumb", () => {
  it("renders no items when pathname is root", () => {
    mockedUsePathname.mockReturnValue("/");
    render(<DynamicBreadcrumb />);
    expect(screen.queryAllByTestId("breadcrumb-item")).toHaveLength(0);
  });

  it("renders single segment", () => {
    mockedUsePathname.mockReturnValue("/dashboard");
    render(<DynamicBreadcrumb />);

    const items = screen.getAllByTestId("breadcrumb-item");
    expect(items).toHaveLength(1);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders multiple segments with separators", () => {
    mockedUsePathname.mockReturnValue("/wallet/123/edit");
    render(<DynamicBreadcrumb />);

    const items = screen.getAllByTestId("breadcrumb-item");
    expect(items).toHaveLength(3);

    expect(screen.getByText("Wallet")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();

    const separators = screen.getAllByTestId("breadcrumb-separator");
    expect(separators).toHaveLength(2);
  });

  it("renders links with correct hrefs", () => {
    mockedUsePathname.mockReturnValue("/transactions/2024");
    render(<DynamicBreadcrumb />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);

    expect(links[0]).toHaveAttribute("href", "/transactions");
    expect(links[1]).toHaveAttribute("href", "/transactions/2024");
  });

  it("capitalizes first letter of each segment", () => {
    mockedUsePathname.mockReturnValue("/user/profile/settings");
    render(<DynamicBreadcrumb />);

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});
