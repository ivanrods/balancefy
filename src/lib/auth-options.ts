import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,

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
          user.password,
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
    async jwt({ token, user, trigger }) {
      // Atualiza dados do usuário no token ao logar ou ao chamar update()
      let email = token.email;
      if (!email && user) email = user.email;
      if (user || trigger === "update") {
        if (email) {
          const dbUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, email: true, image: true },
          });
          if (dbUser) {
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.picture = dbUser.image;
            token.id = dbUser.id;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },

  //  Adiciona categorias logo após criação do usuário
  events: {
    async createUser({ user }) {
      if (!user.id) {
        console.error(
          "Usuário sem ID, não é possível criar categorias e carteira",
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
