import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas/auth-schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, password } = registerSchema.parse(body);

    // Checa se usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Cria usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,

        categories: {
          create: [
            { name: "Alimentação", color: "#660000" },
            { name: "Transporte", color: "#666666" },
            { name: "Moradia", color: "#ff6666" },
            { name: "Lazer", color: "#cc0000" },
            { name: "Outros", color: "#cccccc" },
          ],
        },
        wallets: { create: [{ name: "Carteira Padrão" }] },
      },
    });

    // Retorna dados sem senha
    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
