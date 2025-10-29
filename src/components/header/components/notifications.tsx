import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Megaphone } from "lucide-react";

export function Notifications() {
  const notifications = [{ id: 1, message: "Bem vindo(a) o Balancefy" }];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Bell />
      </PopoverTrigger>
      <PopoverContent className="w-80 mx-4 my-2">
        <div className="grid gap-2">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Notificações</h4>
            <p className="text-muted-foreground text-sm ">
              Suas notificações recentes
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
