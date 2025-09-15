import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";

type Profile = {
  name: string;
  email: string;
};

export function EditProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    }
    fetchProfile();
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <p>Editar perfil</p>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar perfil</SheetTitle>
          <SheetDescription>
            Faça alterações no seu perfil aqui. Clique em Salvar quando
            terminar.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="flex justify-center">
            <Avatar className="mx-auto w-24 h-24">
              <AvatarImage src="/avatar.png" alt="User" className="h-24 w-24" />
              <AvatarFallback>{profile?.name?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Seu nome" value={profile?.name} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="@email.com" value={profile?.email} />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Salvar alterações</Button>
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
