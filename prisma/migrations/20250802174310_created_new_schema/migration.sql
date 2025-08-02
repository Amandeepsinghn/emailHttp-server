/*
  Warnings:

  - You are about to drop the column `improve_points` on the `Ats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Ats" DROP COLUMN "improve_points",
ADD COLUMN     "area_improvement" TEXT[],
ADD COLUMN     "bad" TEXT[],
ADD COLUMN     "good" TEXT[];
