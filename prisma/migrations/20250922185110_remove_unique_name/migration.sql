/*
  Warnings:

  - You are about to drop the column `categoria` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('income', 'expense');

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "categoria",
DROP COLUMN "data",
DROP COLUMN "descricao",
DROP COLUMN "tipo",
DROP COLUMN "valor",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "type" "public"."TransactionType" NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- DropEnum
DROP TYPE "public"."Categoria";

-- DropEnum
DROP TYPE "public"."Tipo";

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_userId_key" ON "public"."Category"("name", "userId");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
