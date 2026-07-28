import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNotifications } from "@/hooks/use-notifications";
import type { Notification } from "@/types/notification";

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

const mockNotif: Notification = {
  id: "n1",
  userId: "u1",
  transactionId: null,
  message: "Vencimento hoje",
  read: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  transaction: null,
};

let mockFetch: jest.Mock;

beforeEach(() => {
  mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
  globalThis.fetch = mockFetch;
});

describe("useNotifications", () => {
  it("retorna lista vazia e unreadCount 0 inicialmente", async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
  });

  it("retorna notificações do fetch", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([mockNotif]) });

    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.notifications).toHaveLength(1));
    expect(result.current.unreadCount).toBe(1);
  });

  it("calcula unreadCount corretamente", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockNotif, { ...mockNotif, id: "n2", read: true }]),
    });

    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.notifications).toHaveLength(2));
    expect(result.current.unreadCount).toBe(1);
  });

  it("usa initialData", () => {
    const { result } = renderHook(() => useNotifications([mockNotif]), {
      wrapper: createWrapper(),
    });
    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.unreadCount).toBe(1);
  });

  it("markAsRead faz PATCH", async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.notifications).toEqual([]);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ...mockNotif, read: true }),
    });
    result.current.markAsRead.mutate("n1");

    await waitFor(() => expect(result.current.markAsRead.isSuccess).toBe(true));
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/notifications/n1",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("markAllAsRead faz PATCH", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });

    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ message: "ok" }) });
    result.current.markAllAsRead.mutate();

    await waitFor(() => expect(result.current.markAllAsRead.isSuccess).toBe(true));
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/notifications/read-all",
      expect.objectContaining({ method: "PATCH" }),
    );
  });
});
