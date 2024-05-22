-- DropForeignKey
ALTER TABLE "flats" DROP CONSTRAINT "flats_userId_fkey";

-- AddForeignKey
ALTER TABLE "flats" ADD CONSTRAINT "flats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
