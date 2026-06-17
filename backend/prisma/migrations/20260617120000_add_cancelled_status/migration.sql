-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'CANCELED';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN "cancelReason" TEXT;
