/*
  Warnings:

  - The primary key for the `RequestLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `eventName` on the `RequestLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RequestLog" DROP CONSTRAINT "RequestLog_eventName_fkey";

-- DropIndex
DROP INDEX "RequestLog_eventName_key";

-- AlterTable
ALTER TABLE "EventMetaData" ADD COLUMN     "requestLogId" TEXT;

-- AlterTable
ALTER TABLE "RequestLog" DROP CONSTRAINT "RequestLog_pkey",
DROP COLUMN "eventName",
ADD CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "EventMetaData" ADD CONSTRAINT "EventMetaData_requestLogId_fkey" FOREIGN KEY ("requestLogId") REFERENCES "RequestLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
