import { render, screen, fireEvent } from "@testing-library/react";
import { Notifications } from "./notifications";
import { useTranslation } from "@/hooks/use-translation";
import { useNotifications } from "@/hooks/use-notifications";

jest.mock("@/hooks/use-translation");
jest.mock("@/hooks/use-notifications");

jest.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div data-testid="popover">{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-trigger">{children}</div>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-content">{children}</div>
  ),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUseTranslation = jest.mocked(useTranslation);
const mockedUseNotifications = jest.mocked(useNotifications);

const mockNotification = {
  id: "n1",
  userId: "u1",
  transactionId: null,
  message: "Vencimento hoje",
  read: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  transaction: null,
};

const mockTransactionNotification = {
  id: "n2",
  userId: "u1",
  transactionId: "tx1",
  message: "",
  read: false,
  createdAt: "2024-01-02T00:00:00.000Z",
  transaction: {
    id: "tx1",
    description: "Salário",
    value: 5000,
    type: "income" as const,
    date: "2024-01-02",
  },
};

const mockMarkAsRead = { mutate: jest.fn(), isPending: false } as unknown as ReturnType<typeof useNotifications>["markAsRead"];
const mockMarkAllAsRead = { mutate: jest.fn(), isPending: false } as unknown as ReturnType<typeof useNotifications>["markAllAsRead"];

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseTranslation.mockReturnValue({
    t: (key: string) => {
      const map: Record<string, string> = {
        "notifications.title": "Notificações",
        "notifications.recentDescription": "Notificações recentes",
        "notifications.markAllAsRead": "Marcar tudo como lido",
        "notifications.noNotifications": "Nenhuma notificação",
        "notifications.markAsRead": "Marcar como lida",
      };
      return map[key] ?? key;
    },
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedUseNotifications.mockReturnValue({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    markAsRead: mockMarkAsRead,
    markAllAsRead: mockMarkAllAsRead,
  });
});

describe("Notifications", () => {
  it("renders bell button with aria-label", () => {
    render(<Notifications />);
    const btn = screen.getByLabelText("Notificações");
    expect(btn).toBeInTheDocument();
  });

  it("shows unread count badge when there are unread notifications", () => {
    mockedUseNotifications.mockReturnValue({
      notifications: [mockNotification],
      unreadCount: 1,
      isLoading: false,
      error: null,
      markAsRead: mockMarkAsRead,
      markAllAsRead: mockMarkAllAsRead,
    });

    render(<Notifications />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows 99+ when unreadCount is over 99", () => {
    mockedUseNotifications.mockReturnValue({
      notifications: [],
      unreadCount: 100,
      isLoading: false,
      error: null,
      markAsRead: mockMarkAsRead,
      markAllAsRead: mockMarkAllAsRead,
    });

    render(<Notifications />);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("does not show badge when unreadCount is 0", () => {
    render(<Notifications />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    expect(screen.queryByText("99+")).not.toBeInTheDocument();
  });

  it("shows mark all as read when there are unread notifications", () => {
    mockedUseNotifications.mockReturnValue({
      notifications: [mockNotification],
      unreadCount: 1,
      isLoading: false,
      error: null,
      markAsRead: mockMarkAsRead,
      markAllAsRead: mockMarkAllAsRead,
    });

    render(<Notifications />);
    expect(screen.getByText("Marcar tudo como lido")).toBeInTheDocument();
  });

  it("hides mark all as read when unreadCount is 0", () => {
    render(<Notifications />);
    expect(
      screen.queryByText("Marcar tudo como lido"),
    ).not.toBeInTheDocument();
  });

  it("shows loading skeletons", () => {
    mockedUseNotifications.mockReturnValue({
      notifications: [],
      unreadCount: 0,
      isLoading: true,
      error: null,
      markAsRead: mockMarkAsRead,
      markAllAsRead: mockMarkAllAsRead,
    });

    const { container } = render(<Notifications />);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons).toHaveLength(2);
  });

  it("shows empty message when no notifications and not loading", () => {
    render(<Notifications />);
    expect(screen.getByText("Nenhuma notificação")).toBeInTheDocument();
  });

  it("renders notification message", () => {
    mockedUseNotifications.mockReturnValue({
      notifications: [mockNotification],
      unreadCount: 1,
      isLoading: false,
      error: null,
      markAsRead: mockMarkAsRead,
      markAllAsRead: mockMarkAllAsRead,
    });

    render(<Notifications />);
    expect(screen.getByText("Vencimento hoje")).toBeInTheDocument();
  });

  it("renders transaction description and formatted value", () => {
    mockedUseNotifications.mockReturnValue({
      notifications: [mockTransactionNotification],
      unreadCount: 1,
      isLoading: false,
      error: null,
      markAsRead: mockMarkAsRead,
      markAllAsRead: mockMarkAllAsRead,
    });

    render(<Notifications />);
    expect(screen.getByText("Salário")).toBeInTheDocument();
    expect(screen.getByText("R$ 5.000,00")).toBeInTheDocument();
  });

  it("renders transaction date", () => {
    mockedUseNotifications.mockReturnValue({
      notifications: [mockTransactionNotification],
      unreadCount: 1,
      isLoading: false,
      error: null,
      markAsRead: mockMarkAsRead,
      markAllAsRead: mockMarkAllAsRead,
    });

    render(<Notifications />);
    expect(screen.getByText(/janeiro de 2024/)).toBeInTheDocument();
  });

  it("calls markAllAsRead.mutate when clicking mark all as read", () => {
    mockedUseNotifications.mockReturnValue({
      notifications: [mockNotification],
      unreadCount: 1,
      isLoading: false,
      error: null,
      markAsRead: mockMarkAsRead,
      markAllAsRead: mockMarkAllAsRead,
    });

    render(<Notifications />);
    fireEvent.click(screen.getByText("Marcar tudo como lido"));
    expect(mockMarkAllAsRead.mutate).toHaveBeenCalledTimes(1);
  });

  it("calls markAsRead.mutate with notification id when clicking mark as read", () => {
    mockedUseNotifications.mockReturnValue({
      notifications: [mockNotification],
      unreadCount: 1,
      isLoading: false,
      error: null,
      markAsRead: mockMarkAsRead,
      markAllAsRead: mockMarkAllAsRead,
    });

    render(<Notifications />);
    const markReadButtons = screen.getAllByLabelText("Marcar como lida");
    expect(markReadButtons).toHaveLength(1);

    fireEvent.click(markReadButtons[0]);
    expect(mockMarkAsRead.mutate).toHaveBeenCalledWith("n1");
  });
});
