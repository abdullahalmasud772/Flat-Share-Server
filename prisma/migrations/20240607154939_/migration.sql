/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `userProfiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `userProfiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userProfiles" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "userProfiles_email_key" ON "userProfiles"("email");
