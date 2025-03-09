/*
  Warnings:

  - Added the required column `instanceCount` to the `EventMetaData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventMetaData" ADD COLUMN     "instanceCount" INTEGER NOT NULL;
