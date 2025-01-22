/*
  Warnings:

  - A unique constraint covering the columns `[ticketUniqueId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "orders_referenceId_key";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "ticketUniqueId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_ticketUniqueId_key" ON "orders"("ticketUniqueId");
