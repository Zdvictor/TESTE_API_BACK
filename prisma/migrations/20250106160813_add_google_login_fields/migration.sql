/*
  Warnings:

  - Added the required column `google_login` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_google` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "google_login" BOOLEAN NOT NULL,
ADD COLUMN     "id_google" TEXT NOT NULL;
