/*
  Warnings:

  - You are about to drop the column `flatOwnerId` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `contactNumber` to the `userProfiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `userProfiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GenderStatus" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "flatOwnerId";

-- AlterTable
ALTER TABLE "userProfiles" ADD COLUMN     "contactNumber" TEXT NOT NULL,
ADD COLUMN     "gender" "GenderStatus" NOT NULL;
