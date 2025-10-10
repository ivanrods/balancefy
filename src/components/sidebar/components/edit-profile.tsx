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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { UserPen } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AvatarProfile } from "./avatar-profile";

const updateUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
});

type updateFormData = z.infer<typeof updateUserSchema>;

export function EditProfile() {
  const [currentAvatar, setcurrentAvatar] = useState("/profile.png");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<updateFormData>({ resolver: zodResolver(updateUserSchema) });

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        reset({
          name: data.name,
          email: data.email,
        });
        setcurrentAvatar(data.image || "/profile.png");
      }
    }
    fetchProfile();
  }, [reset]);

  async function onSubmit(data: updateFormData) {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        image: uploadedImageUrl || currentAvatar,
      }),
    });

    if (res.ok) {
      toast.success("Perfil atualizado com sucesso!");
    } else {
      toast.error("Erro ao atualizar perfil.");
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild className="w-full">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <UserPen className="w-4 h-4 mr-2" /> Editar perfil
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar perfil</SheetTitle>
          <SheetDescription>
            Faça alterações no seu perfil aqui. Clique em Salvar quando
            terminar.
          </SheetDescription>
        </SheetHeader>
        <form
          className="grid flex-1 auto-rows-min gap-6 px-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex justify-center ">
            <AvatarProfile
              imageUrl={currentAvatar}
              onUpload={handleImageUpload}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">Nome</Label>
            <Input type="text" placeholder="Nome" {...register("name")} />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input type="email" placeholder="E-mail" {...register("email")} />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
        </form>
        <SheetFooter>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            Salvar alterações
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
