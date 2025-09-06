import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Bell, Plus } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { ButtonTheme } from "./button-theme";

export function AppHeader() {
  return (
    <header className=" flex items-center gap-4 p-4 border-b">
      <SidebarTrigger />
      <div className="min-w-max hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Input placeholder="Buscar transação" />
      <Button>
        <Plus /> <p className="hidden md:block ">Nova Transação</p>
      </Button>
      <ButtonTheme />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-muted transition rounded-full">
            <Bell />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="p-2 m-2">
            <DropdownMenuItem>Saldo atualizado</DropdownMenuItem>
            <DropdownMenuItem>Transação concluída</DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
