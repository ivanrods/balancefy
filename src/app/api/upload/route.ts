import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Converte File em base64 para enviar ao Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64String, {
      folder: "user-profiles",
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("Erro no upload:", err);
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
  }
}
