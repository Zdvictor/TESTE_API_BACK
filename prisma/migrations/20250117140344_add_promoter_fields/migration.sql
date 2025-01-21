-- AlterTable
ALTER TABLE "promoters" ADD COLUMN     "google_login" BOOLEAN,
ADD COLUMN     "id_google" TEXT,
ALTER COLUMN "password_hash" DROP NOT NULL,
ALTER COLUMN "account_type" DROP NOT NULL;
