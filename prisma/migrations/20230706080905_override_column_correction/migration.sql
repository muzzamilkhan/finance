/*
  Warnings:

  - You are about to drop the column `particulars_id` on the `Overrides` table. All the data in the column will be lost.
  - Added the required column `particular_id` to the `Overrides` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Overrides" DROP COLUMN "particulars_id",
ADD COLUMN     "particular_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Overrides" ADD CONSTRAINT "Overrides_particular_id_fkey" FOREIGN KEY ("particular_id") REFERENCES "Particulars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
