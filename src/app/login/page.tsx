"use client";

import { signIn, useSession } from "next-auth/react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/schemas/auth-schema";
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
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { update } = useSession();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.ok) {
        // Refresh session before navigating
        await update();
        router.push("/dashboard");
      } else {
        toast.error(res?.error || t("auth.loginError"));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error(t("auth.loginError"));
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("auth.loginTitle")}</CardTitle>

          <CardDescription>{t("auth.loginDescription")}</CardDescription>
          <CardAction>
            <Button variant="link">
              <Link href="/register">{t("auth.signUp")}</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input type="email" placeholder={t("auth.email")} {...register("email")} />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input type="password" placeholder={t("auth.password")} {...register("password")} />
                {errors.password && (
                  <span className="text-red-500 text-sm">{errors.password.message}</span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 pt-6">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {t("auth.loginSubmit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              {t("auth.loginGoogle")}
            </Button>
          </CardFooter>{" "}
        </form>
      </Card>
    </div>
  );
}
