import { Search } from "lucide-react";
import { CommandMenu } from "./command-menu";
import { Input } from "./ui/input";

export function InputSearch() {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />

      <Input placeholder="Buscar transação" className="pl-9 pr-20" />
      <div className="absolute right-1 top-1/2 -translate-y-1/2">
        <CommandMenu />
      </div>
    </div>
  );
}
