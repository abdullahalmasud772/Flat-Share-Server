/*
  Warnings:

  - You are about to drop the column `Amenities` on the `flats` table. All the data in the column will be lost.
  - Added the required column `amenities` to the `flats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "flats" DROP COLUMN "Amenities",
ADD COLUMN     "amenities" TEXT NOT NULL,
ADD COLUMN     "flatPhoto" TEXT;
