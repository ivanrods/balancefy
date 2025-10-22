import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    );
  }
  const account = await prisma.account.findFirst({
    where: { user: { email: session.user.email } },
    select: { provider: true },
  });

  return NextResponse.json({
    ...user,
    provider: account?.provider ?? "credentials",
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Busca a conta para ver o provedor
  const account = await prisma.account.findFirst({
    where: { user: { email: session.user.email } },
  });

  if (account?.provider === "google") {
    return NextResponse.json(
      { error: "Usuários do Google não podem editar dados aqui." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { name, email, image, password } = body;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Nome e email são obrigatórios" },
      { status: 400 }
    );
  }

  const dataToUpdate: Partial<User> = { name, email, image };

  // Se o usuário informou uma nova senha → gera o hash
  if (password && password.trim().length > 0) {
    const hashedPassword = await bcrypt.hash(password, 10);
    dataToUpdate.password = hashedPassword;
  }

  const updated = await prisma.user.update({
    where: { email: session.user.email },
    data: dataToUpdate,
    select: { id: true, name: true, email: true, image: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Não autenticado" }), {
      status: 401,
    });
  }

  try {
    await prisma.user.delete({
      where: { email: session.user.email },
    });

    return new Response(
      JSON.stringify({ message: "Conta excluída com sucesso" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Erro ao excluir conta" }), {
      status: 500,
    });
  }
}
