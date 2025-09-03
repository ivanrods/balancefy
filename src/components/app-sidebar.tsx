import {
  ChartBarStacked,
  CircleGauge,
  ArrowLeftRight,
  ClipboardMinus,
  Settings,
  LogOut,
  Info,
  Trash,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: CircleGauge,
  },
  {
    title: "Transações",
    url: "transactions",
    icon: ArrowLeftRight,
  },
  {
    title: "Categorias",
    url: "categories",
    icon: ChartBarStacked,
  },
  {
    title: "Relatórios",
    url: "Reports",
    icon: ClipboardMinus,
  },
  {
    title: "Ajuda",
    url: "help",
    icon: Info,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        {/* Navegação principal */}
        <div className="flex-1">
          <SidebarGroup>
            <div className="py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-4 w-full p-2 hover:bg-muted transition">
                    <Image
                      src="/logo.png"
                      alt="logo"
                      width={35}
                      height={35}
                      className="rounded-sm"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-md font-semibold line-clamp-1">
                        Balancefy
                      </span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60">
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Rodapé - Perfil do usuário */}
        <div className="p-2 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 w-full rounded-lg p-2 hover:bg-muted transition">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback>IR</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium line-clamp-1">
                    Ivan Rodrigues
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ivan@email.com
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash className="w-4 h-4 mr-2 text-primary" />
                Excluir conta
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
