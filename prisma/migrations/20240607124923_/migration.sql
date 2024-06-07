/*
  Warnings:

  - You are about to drop the column `email` on the `userProfiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "userProfiles_email_key";

-- AlterTable
ALTER TABLE "userProfiles" DROP COLUMN "email";
