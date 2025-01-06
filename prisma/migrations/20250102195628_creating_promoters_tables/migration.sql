-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('PF', 'PJ');

-- CreateTable
CREATE TABLE "promoters" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "pix_key" TEXT NOT NULL,
    "account_type" "AccountType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promoters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoterPF" (
    "promoter_id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "residencial_address" TEXT NOT NULL,
    "business_address" TEXT NOT NULL,
    "cellphone" TEXT NOT NULL,

    CONSTRAINT "PromoterPF_pkey" PRIMARY KEY ("promoter_id")
);

-- CreateTable
CREATE TABLE "PromoterPJ" (
    "promoter_id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "comporate_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "cellphone" TEXT NOT NULL,

    CONSTRAINT "PromoterPJ_pkey" PRIMARY KEY ("promoter_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promoters_email_key" ON "promoters"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PromoterPF_cpf_key" ON "PromoterPF"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "PromoterPF_rg_key" ON "PromoterPF"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "PromoterPJ_cnpj_key" ON "PromoterPJ"("cnpj");

-- AddForeignKey
ALTER TABLE "PromoterPF" ADD CONSTRAINT "PromoterPF_promoter_id_fkey" FOREIGN KEY ("promoter_id") REFERENCES "promoters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoterPJ" ADD CONSTRAINT "PromoterPJ_promoter_id_fkey" FOREIGN KEY ("promoter_id") REFERENCES "promoters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
