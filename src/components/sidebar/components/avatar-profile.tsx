"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

type AvatarProfileProps = {
  imageUrl?: string | null;
  onUpload?: (base64: string) => void;
  disabled?: boolean;
};

export function AvatarProfile({
  imageUrl,
  onUpload,
  disabled,
}: AvatarProfileProps) {
  const [preview, setPreview] = useState(imageUrl || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPreview(imageUrl || null);
  }, [imageUrl]);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        const imageUrl = data.url;
        setPreview(imageUrl);
        onUpload?.(imageUrl);
      } else {
        console.error("Erro no upload", data.error);
      }
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-32 h-26">
      <Avatar className="mx-auto w-24 h-24 rounded-full overflow-hidden relative">
        <AvatarImage
          src={preview || "/avatar.png"}
          alt="User"
          className={`h-24 w-24 object-cover ${
            loading ? "opacity-50" : "opacity-100"
          }`}
        />
        <AvatarFallback>CN</AvatarFallback>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <LoaderCircle className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </Avatar>

      <label
        htmlFor="avatar-upload"
        className={`absolute bottom-2 right-2 bg-primary p-1 rounded-full shadow-md cursor-pointer opacity-90 hover:opacity-100 transition text-white ${
          disabled || loading ? "hidden" : ""
        }`}
        title="Alterar foto"
      >
        <Camera className="w-8 h-8 p-1" />
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImage}
          disabled={disabled}
        />
      </label>
    </div>
  );
}
