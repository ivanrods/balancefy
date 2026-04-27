"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

type AvatarProfileProps = {
  imageUrl?: string | null;
  onSelectFile?: (file: File | null, previewUrl: string | null) => void;
  disabled?: boolean;
};

export function AvatarProfile({
  imageUrl,
  onSelectFile,
  disabled,
}: AvatarProfileProps) {
  const [preview, setPreview] = useState(imageUrl || null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPreview(imageUrl || null);
  }, [imageUrl]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(imageUrl || null);
      onSelectFile?.(null, imageUrl || null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      onSelectFile?.(file, reader.result as string);
    };
    reader.readAsDataURL(file);
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
