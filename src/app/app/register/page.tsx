"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/lib/schemas/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/login");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
      >
        <h1 className="mb-6 text-center text-2xl font-bold">Registrar</h1>
        <Input
          type="email"
          placeholder="Digite seu e-mail"
          {...register("email")}
          className="mb-4"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
        <Input
          type="password"
          placeholder="Digite sua senha"
          {...register("senha")}
          className="mb-4"
        />
        <Button type="submit" className="w-full">
          Registrar
        </Button>
      </form>
    </div>
  );
}
