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
import { AlertCircleIcon, UserPen } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AvatarProfile } from "./avatar-profile";
import { Alert, AlertTitle } from "@/components/ui/alert";

import { updateUserSchema } from "@/lib/schemas/update-user-schema";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/hooks/use-translation";

type updateFormData = z.infer<typeof updateUserSchema>;

export function EditProfile() {
  const { t } = useTranslation();
  const { data: session, update } = useSession();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

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
        setAvatar(data.image || null);
        setSelectedFile(null);
        setIsGoogleUser(data.provider === "google");
      }
    }
    fetchProfile();
  }, [reset]);

  async function onSubmit(data: updateFormData) {
    let imageUrl = avatar;
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const resUpload = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await resUpload.json();
        if (resUpload.ok) {
          imageUrl = uploadData.url;
        } else {
          toast.error(t("profile.imageError") + " " + (uploadData.error || ""));
          return;
        }
      } catch (err) {
        toast.error(t("profile.imageError"));
        return;
      }
    }

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        image: imageUrl,
      }),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      if (update) {
        await update({
          user: {
            ...session?.user,
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image,
          },
        });
      }
      toast.success(t("profile.success"));
    } else {
      toast.error(t("profile.error"));
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild className="w-full">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <UserPen className="w-4 h-4 mr-2" /> {t("nav.editProfile")}
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("profile.editTitle")}</SheetTitle>
          <SheetDescription>{t("profile.editDescription")}</SheetDescription>
        </SheetHeader>
        <form className="grid flex-1 auto-rows-min gap-6 px-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center ">
            <AvatarProfile
              imageUrl={avatar}
              onSelectFile={(file, previewUrl) => {
                setSelectedFile(file);
                if (previewUrl) setAvatar(previewUrl);
              }}
              disabled={isGoogleUser}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">{t("profile.name")}</Label>
            <Input
              type="text"
              placeholder={t("profile.namePlaceholder")}
              {...register("name")}
              disabled={isGoogleUser}
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">{t("profile.email")}</Label>
            <Input
              type="email"
              placeholder={t("profile.emailPlaceholder")}
              {...register("email")}
              disabled={isGoogleUser}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>
          <div className="grid gap-3">
            <Label>{t("profile.password")}</Label>
            <Input
              type="password"
              {...register("password")}
              className="input"
              placeholder={t("profile.passwordPlaceholder")}
              disabled={isGoogleUser}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
        </form>
        <SheetFooter>
          {isGoogleUser && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{t("profile.googleAlert")}</AlertTitle>
            </Alert>
          )}
          <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isGoogleUser}>
            {t("profile.save")}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">{t("profile.close")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
