/*
  Warnings:

  - You are about to alter the column `contactNumber` on the `userProfiles` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "userProfiles" ALTER COLUMN "contactNumber" SET DATA TYPE INTEGER;
