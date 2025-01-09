/*
  Warnings:

  - You are about to drop the column `disable_account` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "disable_account",
ADD COLUMN     "disable" BOOLEAN NOT NULL DEFAULT false;
