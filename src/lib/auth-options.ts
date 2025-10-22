import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            image: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("E-mail não encontrado");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("E-mail ou Senha incorreta");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },

  //  Adiciona categorias logo após criação do usuário
  events: {
    async createUser({ user }) {
      if (!user.id) {
        console.error(
          "Usuário sem ID, não é possível criar categorias e carteira"
        );
        return;
      }
      await prisma.wallet.create({
        data: { name: "Carteira Padrão", userId: user.id },
      });

      await prisma.category.createMany({
        data: [
          { name: "Alimentação", color: "#660000", userId: user.id },
          { name: "Transporte", color: "#666666", userId: user.id },
          { name: "Moradia", color: "#ff6666", userId: user.id },
          { name: "Lazer", color: "#cc0000", userId: user.id },
          { name: "Outros", color: "#cccccc", userId: user.id },
        ],
      });
    },
  },
};
