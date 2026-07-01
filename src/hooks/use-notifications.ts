import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/types/notification";

export function useNotifications() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Erro ao buscar notificações");
      return res.json();
    },
    refetchInterval: 60_000,
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Erro ao marcar notificação como lida");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Erro ao marcar notificações como lidas");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications: data ?? [],
    unreadCount: data?.filter((n) => !n.read).length ?? 0,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
  };
}
