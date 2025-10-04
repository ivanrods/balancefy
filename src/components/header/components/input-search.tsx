import * as React from "react";
import { Search } from "lucide-react";
import { SearchDialog } from "./search-dialog";
import { Input } from "../../ui/input";

export function InputSearch() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />

      <Input
        placeholder="Buscar"
        className="pl-9 pr-20 "
        onFocus={() => setOpen(true)}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <SearchDialog open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}
