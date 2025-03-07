/*
  Warnings:

  - You are about to drop the column `imageSrc` on the `EventMetaData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventInstance" ADD COLUMN     "imageSrc" TEXT[];

-- AlterTable
ALTER TABLE "EventMetaData" DROP COLUMN "imageSrc";
