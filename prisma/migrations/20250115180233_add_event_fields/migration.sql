/*
  Warnings:

  - You are about to drop the column `location` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "location",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "expectedAudience" INTEGER,
ADD COLUMN     "locationName" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "streetNumber" TEXT,
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "zipCode" TEXT;
