/*
  Warnings:

  - Added the required column `flatName` to the `flats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "flats" ADD COLUMN     "flatName" TEXT NOT NULL;
