/*
  Warnings:

  - You are about to drop the column `readTime` on the `Blogs` table. All the data in the column will be lost.
  - You are about to drop the column `ref` on the `Blogs` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Blogs` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Blogs` table. All the data in the column will be lost.
  - Added the required column `count` to the `Blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Blogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Blogs" DROP COLUMN "readTime",
DROP COLUMN "ref",
DROP COLUMN "summary",
DROP COLUMN "title",
ADD COLUMN     "count" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Blogs" ADD CONSTRAINT "Blogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
