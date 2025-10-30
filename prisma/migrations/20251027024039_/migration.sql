/*
  Warnings:

  - You are about to drop the column `body` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `body` on the `Response` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "body",
ADD COLUMN     "bodyPreview" JSONB,
ADD COLUMN     "bodyUrl" TEXT;

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "body",
ADD COLUMN     "bodyPreview" JSONB,
ADD COLUMN     "bodyUrl" TEXT;
