import { Search } from "lucide-react";
import { CommandMenu } from "./command-menu";
import { Input } from "./ui/input";

export function InputSearch() {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />

      <Input placeholder="Buscar" className="pl-9 pr-20 " />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <CommandMenu />
      </div>
    </div>
  );
}
