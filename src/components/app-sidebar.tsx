import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  ChartBarStacked,
  CircleGauge,
  ArrowLeftRight,
  ClipboardMinus,
  Info,
  Settings,
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

import UserMenu from "./user-menu"; // client component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";

const items = [
  { title: "Dashboard", url: "dashboard", icon: CircleGauge },
  { title: "Transações", url: "transactions", icon: ArrowLeftRight },
  { title: "Categorias", url: "categories", icon: ChartBarStacked },
  { title: "Relatórios", url: "reports", icon: ClipboardMinus },
  { title: "Ajuda", url: "help", icon: Info },
];

export async function AppSidebar() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        <div className="flex-1">
          <div className="p-2">
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
          <SidebarGroup>
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

        {/* Rodapé com menu de usuário */}
        <UserMenu user={user} />
      </SidebarContent>
    </Sidebar>
  );
}
