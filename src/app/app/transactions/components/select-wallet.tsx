import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../../../../components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Wallet = {
  id: string;
  name: string;
};

type SelectDialogProps = {
  value: string;
  onValueChange: (val: string) => void;
  wallets: Wallet[];
};

export function SelectWallet({
  value,
  onValueChange,
  wallets,
}: SelectDialogProps) {
  return (
    <div className="flex flex-col gap-3">
      <Select value={value} onValueChange={onValueChange}>
        <Label className="px-1">Carteira</Label>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione a carteira" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Carteiras</SelectLabel>
            {wallets.map((wallet) => (
              <SelectItem key={wallet.id} value={wallet.id}>
                {wallet.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <Button className="w-full text-sm" variant="link">
            <Link href="/app/wallet"> + Criar Carteira</Link>
          </Button>
        </SelectContent>
      </Select>
    </div>
  );
}
