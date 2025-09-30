/*
  Warnings:

  - A unique constraint covering the columns `[flatId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `flatId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "flatId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_flatId_key" ON "Payment"("flatId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "flats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
