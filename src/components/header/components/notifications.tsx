import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Megaphone } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function Notifications() {
  const { t } = useTranslation();
  const notifications = [{ id: 1, message: t("notifications.welcome") }];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Bell />
      </PopoverTrigger>
      <PopoverContent className="w-80 mx-4 my-2">
        <div className="grid gap-2">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">{t("notifications.title")}</h4>
            <p className="text-muted-foreground text-sm ">
              {t("notifications.recentDescription")}
            </p>
          </div>
          {notifications.map((notification) => (
            <Alert variant="default" key={notification.id}>
              <Megaphone />
              <AlertTitle>{notification.message}</AlertTitle>
            </Alert>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
