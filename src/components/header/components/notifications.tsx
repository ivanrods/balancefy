import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Check, Megaphone } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useNotifications } from "@/hooks/use-notifications";
import { Skeleton } from "@/components/ui/skeleton";
import { Notification } from "@/types/notification";

function formatCurrency(value: number, locale: string) {
  const currency = locale === "en" ? "USD" : "BRL";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

function formatDate(dateStr: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

type NotificationsProps = {
  initialNotifications?: Notification[];
};

export function Notifications({ initialNotifications }: NotificationsProps) {
  const { t, locale } = useTranslation();
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } =
    useNotifications(initialNotifications);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative"
          aria-label={t("notifications.title")}
        >
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-4 h-4 px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 mx-4 my-2" align="end">
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1">
              <h4 className="leading-none font-medium">
                {t("notifications.title")}
              </h4>
              <p className="text-muted-foreground text-sm">
                {t("notifications.recentDescription")}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-auto py-1 px-2"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
              >
                <Check className="size-3" />
                {t("notifications.markAllAsRead")}
              </Button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-muted-foreground text-xs text-center py-4">
                {t("notifications.noNotifications")}
              </p>
            ) : (
              notifications.map((notification) => (
                <Alert variant="default" key={notification.id}>
                  <Megaphone className="mt-1 size-4 shrink-0" />
                  <div className="col-start-2 flex items-start gap-2 min-w-0">
                    <div className="flex-1 space-y-1">
                      <AlertDescription className="text-sm text-foreground m-0">
                        {notification.transaction ? (
                          <>
                            <AlertTitle className="col-start-1 text-sm font-semibold m-0">
                              {notification.transaction.description}
                            </AlertTitle>

                            <span className="text-muted-foreground">
                              {" "}
                              {formatCurrency(
                                notification.transaction.value,
                                locale,
                              )}
                            </span>
                          </>
                        ) : (
                          notification.message
                        )}
                      </AlertDescription>
                      {notification.transaction && (
                        <p className="text-xs text-muted-foreground m-0">
                          {formatDate(notification.transaction.date, locale)}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0 mt-1"
                      onClick={() => markAsRead.mutate(notification.id)}
                      disabled={markAsRead.isPending}
                      aria-label={t("notifications.markAsRead")}
                    >
                      <Check className="size-3" />
                    </Button>
                  </div>
                </Alert>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
