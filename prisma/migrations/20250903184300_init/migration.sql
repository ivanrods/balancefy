-- CreateEnum
CREATE TYPE "public"."Categoria" AS ENUM ('Alimentacao', 'Transporte', 'Moradia', 'Lazer', 'Outros');

-- CreateEnum
CREATE TYPE "public"."Tipo" AS ENUM ('entrada', 'saida');

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" "public"."Categoria" NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipo" "public"."Tipo" NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
