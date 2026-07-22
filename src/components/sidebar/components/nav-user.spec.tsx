import { render, screen, fireEvent } from "@testing-library/react";
import { NavUser } from "./nav-user";
import { useTranslation } from "@/hooks/use-translation";
import { useSession, signOut } from "next-auth/react";
import { useSidebar } from "@/components/ui/sidebar";

jest.mock("@/hooks/use-translation");
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("@/components/ui/sidebar", () => ({
  useSidebar: jest.fn(),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu">{children}</div>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarMenuButton: ({
    children,
    size,
    className,
  }: {
    children: React.ReactNode;
    size?: string;
    className?: string;
  }) => (
    <button data-testid="sidebar-menu-button" data-size={size} className={className}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="avatar" className={className}>{children}</span>
  ),
  AvatarImage: ({ src, alt }: { src?: string; alt?: string }) => (
    <img data-testid="avatar-image" src={src} alt={alt} />
  ),
  AvatarFallback: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="avatar-fallback" className={className}>{children}</span>
  ),
}));

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-label">{children}</div>
  ),
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-group">{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <div data-testid="dropdown-item" onClick={onClick}>
      {children}
    </div>
  ),
  DropdownMenuSeparator: () => <hr data-testid="dropdown-separator" />,
}));

jest.mock("./edit-profile", () => ({
  EditProfile: () => <div data-testid="edit-profile" />,
}));

jest.mock("./drawer-config", () => ({
  DrawerConfig: () => <div data-testid="drawer-config" />,
}));

jest.mock("./delete-account-dialog", () => ({
  DeleteAccountDialog: () => <div data-testid="delete-account-dialog" />,
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUseTranslation = jest.mocked(useTranslation);
const mockedUseSession = jest.mocked(useSession);
const mockedUseSidebar = jest.mocked(useSidebar);
const mockedSignOut = jest.mocked(signOut);

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "nav.signOut": "Sair",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedUseSidebar.mockReturnValue({
    state: "expanded",
    open: true,
    setOpen: jest.fn(),
    openMobile: false,
    setOpenMobile: jest.fn(),
    isMobile: false,
    toggleSidebar: jest.fn(),
  });

  mockedUseSession.mockReturnValue({
    data: {
      user: {
        name: "João Silva",
        email: "joao@email.com",
        image: "https://example.com/photo.jpg",
      },
      expires: "2099-01-01",
    },
    status: "authenticated",
  } as unknown as ReturnType<typeof useSession>);
});

describe("NavUser", () => {
  it("renders user avatar with image", () => {
    render(<NavUser />);
    const imgs = screen.getAllByTestId("avatar-image") as HTMLImageElement[];
    expect(imgs).toHaveLength(2);
    expect(imgs[0].src).toContain("https://example.com/photo.jpg");
    expect(imgs[0].alt).toBe("João Silva");
  });

  it("renders user name and email", () => {
    render(<NavUser />);
    const names = screen.getAllByText("João Silva");
    expect(names).toHaveLength(2);
    expect(screen.getAllByText("joao@email.com")).toHaveLength(2);
  });

  it("renders fallback avatar when no session user image", () => {
    mockedUseSession.mockReturnValue({
      data: {
        user: { name: "User", email: "user@email.com", image: null },
        expires: "2099-01-01",
      },
      status: "authenticated",
    } as unknown as ReturnType<typeof useSession>);

    render(<NavUser />);
    const imgs = screen.getAllByTestId("avatar-image") as HTMLImageElement[];
    expect(imgs).toHaveLength(2);
    expect(imgs[0].src).toContain("/avatar.png");
  });

  it("renders default text when no user name in session", () => {
    mockedUseSession.mockReturnValue({
      data: {
        user: { name: null, email: null, image: null },
        expires: "2099-01-01",
      },
      status: "authenticated",
    } as unknown as ReturnType<typeof useSession>);

    render(<NavUser />);
    const texts = screen.getAllByText("User");
    expect(texts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders sub-components: EditProfile, DrawerConfig, DeleteAccountDialog", () => {
    render(<NavUser />);
    expect(screen.getByTestId("edit-profile")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-config")).toBeInTheDocument();
    expect(screen.getByTestId("delete-account-dialog")).toBeInTheDocument();
  });

  it("renders sign out button", () => {
    render(<NavUser />);
    expect(screen.getByText("Sair")).toBeInTheDocument();
  });

  it("calls signOut when sign out button is clicked", () => {
    render(<NavUser />);
    fireEvent.click(screen.getByText("Sair"));
    expect(mockedSignOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });

  it("renders sidebar menu structure", () => {
    render(<NavUser />);
    expect(screen.getByTestId("sidebar-menu")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-menu-button")).toBeInTheDocument();
  });

  it("renders dropdown separators", () => {
    render(<NavUser />);
    const separators = screen.getAllByTestId("dropdown-separator");
    expect(separators).toHaveLength(2);
  });
});
