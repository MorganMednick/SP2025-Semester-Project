/*
  Warnings:

  - You are about to drop the column `priceMax` on the `PriceOption` table. All the data in the column will be lost.
  - You are about to drop the column `priceMin` on the `PriceOption` table. All the data in the column will be lost.
  - Added the required column `price` to the `PriceOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventInstance" ADD COLUMN     "coverImage" TEXT;

-- AlterTable
ALTER TABLE "PriceOption" DROP COLUMN "priceMax",
DROP COLUMN "priceMin",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "url" TEXT;
