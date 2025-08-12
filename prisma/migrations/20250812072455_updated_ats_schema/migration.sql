/*
  Warnings:

  - Added the required column `resumeUrl` to the `Ats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Ats" ADD COLUMN     "resumeUrl" TEXT NOT NULL;
