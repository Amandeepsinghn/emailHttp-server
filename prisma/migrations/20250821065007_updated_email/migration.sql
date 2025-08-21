/*
  Warnings:

  - You are about to drop the column `body` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Email` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Email" DROP COLUMN "body",
DROP COLUMN "subject";
