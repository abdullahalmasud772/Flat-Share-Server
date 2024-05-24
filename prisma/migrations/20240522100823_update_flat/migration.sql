/*
  Warnings:

  - You are about to drop the column `userId` on the `flats` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `flats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "flats" DROP CONSTRAINT "flats_userId_fkey";

-- AlterTable
ALTER TABLE "flats" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "flats" ADD CONSTRAINT "flats_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
