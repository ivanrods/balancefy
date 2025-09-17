import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Megaphone } from "lucide-react";

export function Notifications() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Bell />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Notificações</h4>
            <p className="text-muted-foreground text-sm ">
              Suas notificações recentes
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex gap-2 p-3 rounded-md bg-secondary">
              <Megaphone size={20} />{" "}
              <span className="text-sm">Nova notificaçao</span>
            </div>
            <div className="flex gap-2 p-3 rounded-md bg-secondary">
              <Megaphone size={20} />{" "}
              <span className="text-sm">Outra notificaçao</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
