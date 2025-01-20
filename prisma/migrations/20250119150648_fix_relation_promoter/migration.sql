-- DropForeignKey
ALTER TABLE "PromoterPF" DROP CONSTRAINT "PromoterPF_promoter_id_fkey";

-- DropForeignKey
ALTER TABLE "PromoterPJ" DROP CONSTRAINT "PromoterPJ_promoter_id_fkey";

-- AddForeignKey
ALTER TABLE "PromoterPF" ADD CONSTRAINT "PromoterPF_promoter_id_fkey" FOREIGN KEY ("promoter_id") REFERENCES "promoters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoterPJ" ADD CONSTRAINT "PromoterPJ_promoter_id_fkey" FOREIGN KEY ("promoter_id") REFERENCES "promoters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
