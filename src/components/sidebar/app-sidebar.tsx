import {
  ChartBarStacked,
  CircleGauge,
  ArrowLeftRight,
  ClipboardMinus,
  Info,
  Wallet,
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
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

import { NavUser } from "./components/nav-user";
import { getServerTranslations } from "@/lib/locale";

const navItems = [
  { key: "dashboard", url: "dashboard", icon: CircleGauge },
  { key: "wallet", url: "wallet", icon: Wallet },
  { key: "transactions", url: "transactions", icon: ArrowLeftRight },
  { key: "categories", url: "categories", icon: ChartBarStacked },
  { key: "reports", url: "reports", icon: ClipboardMinus },
  { key: "help", url: "help", icon: Info },
];

export async function AppSidebar() {
  const t = await getServerTranslations();
  const items = navItems.map((item) => ({
    ...item,
    title: t(`sidebar.${item.key}`),
  }));

  return (
    <Sidebar className="md:border-none">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="#">
                <Wallet className="text-primary size-5!" />

                <span className="text-base font-semibold">Balancefy</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full flex-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.key}>
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
