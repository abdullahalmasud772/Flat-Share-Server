-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "payStatus" SET DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "flats" ADD COLUMN     "flatNo" TEXT NOT NULL DEFAULT '';
