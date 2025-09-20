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
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";

const updateUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
});

type updateFormData = z.infer<typeof updateUserSchema>;

export function EditProfile() {
  const [userImage, setUserImage] = useState<string | null>(null);
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
        setUserImage(data.image);
      }
    }
    fetchProfile();
  }, [reset]);

  async function onSubmit(data: updateFormData) {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data }),
    });

    if (res.ok) {
      toast("Perfil atualizado com sucesso!");
    } else {
      toast("Erro ao atualizar perfil.");
    }
  }

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
        <form
          className="grid flex-1 auto-rows-min gap-6 px-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex justify-center ">
            <Avatar className="mx-auto w-24 h-24 rounded-full overflow-hidden">
              <AvatarImage
                src={userImage ?? ""}
                alt="User"
                onError={(e) => {
                  e.currentTarget.src = "/avatar.png";
                }}
                className="h-24 w-24"
              />
              <AvatarFallback>{"?"}</AvatarFallback>
            </Avatar>
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
