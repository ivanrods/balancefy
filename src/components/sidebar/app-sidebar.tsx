import {
  ChartBarStacked,
  CircleGauge,
  ArrowLeftRight,
  ClipboardMinus,
  Info,
  Wheat,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";

import UserMenu from "./user-menu";

import Image from "next/image";

const items = [
  { title: "Dashboard", url: "dashboard", icon: CircleGauge },
  { title: "Transações", url: "transactions", icon: ArrowLeftRight },
  { title: "Categorias", url: "categories", icon: ChartBarStacked },
  { title: "Relatórios", url: "reports", icon: ClipboardMinus },
  { title: "Ajuda", url: "help", icon: Info },
];

export async function AppSidebar() {
  return (
    <Sidebar className="md:border-none">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={30}
                  height={30}
                  className="rounded-sm"
                />

                <span className="text-base font-semibold">Balancefy</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full ">
        <div className="flex-1">
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
        <UserMenu />
      </SidebarContent>
    </Sidebar>
  );
}
