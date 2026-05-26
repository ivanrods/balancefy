"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/schemas/auth-schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { useTranslation } from "@/hooks/use-translation";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();

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
        name: data.name,
        email: data.email,
        password: data.password,
        redirect: false,
      }),
    });

    const responseData = await res.json();

    if (res.ok) {
      toast.success("usuário criado com sucesso");
      router.push("/login");
    } else {
      toast.error(responseData.error || t("auth.registerError"));
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("auth.registerTitle")}</CardTitle>
          <CardDescription>
            {t("auth.registerDescription")}
          </CardDescription>
          <CardAction>
            <Button variant="link">
              <Link href="/login">{t("auth.signIn")}</Link>{" "}
            </Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">{t("auth.name")}</Label>
                <Input type="text" placeholder={t("auth.name")} {...register("name")} />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  type="email"
                  placeholder={t("auth.email")}
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t("auth.password")}</Label>

                <Input
                  type="password"
                  placeholder={t("auth.password")}
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 pt-6">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {t("auth.registerSubmit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                signIn("google", { callbackUrl: "/app/dashboard" })
              }
            >
              {t("auth.registerGoogle")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
