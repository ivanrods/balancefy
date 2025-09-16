"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, UserPen } from "lucide-react";
import { signOut } from "next-auth/react";
import { EditProfile } from "./edit-profile";
import { useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  image?: string;
};

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="p-2 border-t">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 w-full rounded-lg p-2 hover:bg-muted transition">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.image ?? "/avatar.png"}
                alt={user?.name ?? "User"}
              />
              <AvatarFallback>{user?.name?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium line-clamp-1">
                {user?.name ?? "Usuário"}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <UserPen className="w-4 h-4 mr-2" />
            <EditProfile />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
