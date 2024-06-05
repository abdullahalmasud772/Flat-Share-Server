/*
  Warnings:

  - A unique constraint covering the columns `[flatName]` on the table `flats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "flats_flatName_key" ON "flats"("flatName");
