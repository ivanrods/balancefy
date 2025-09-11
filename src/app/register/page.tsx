"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/schemas/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.nome,
        email: data.email,
        password: data.senha,
        redirect: false,
      }),
    });

    data = await res.json();

    if (res.ok) {
      router.push("/login");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Crie sua conta</CardTitle>
          <CardDescription>
            Preencha seus dados para criar sua conta
          </CardDescription>
          <CardAction>
            <Button variant="link">
              <Link href="/login">Fazer login</Link>{" "}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input type="text" placeholder="Nome" {...register("nome")} />
                {errors.nome && (
                  <span className="text-red-500 text-sm">
                    {errors.nome.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  placeholder="E-mail"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>

                <Input
                  type="password"
                  placeholder="Senha"
                  {...register("senha")}
                />
                {errors.senha && (
                  <span className="text-red-500 text-sm">
                    {errors.senha.message}
                  </span>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            onClick={handleSubmit(onSubmit)}
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            Criar conta
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/app/dashboard" })}
          >
            Entrar com Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
