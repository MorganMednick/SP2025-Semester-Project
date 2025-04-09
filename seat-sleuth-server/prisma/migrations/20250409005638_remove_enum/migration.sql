/*
  Warnings:

  - Changed the type of `source` on the `PriceOption` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PriceOption" DROP COLUMN "source",
ADD COLUMN     "source" TEXT NOT NULL;

-- DropEnum
DROP TYPE "PriceOptionSource";

-- CreateIndex
CREATE UNIQUE INDEX "PriceOption_eventInstanceId_source_key" ON "PriceOption"("eventInstanceId", "source");
