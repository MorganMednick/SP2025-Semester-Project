/*
  Warnings:

  - You are about to drop the column `requestLogId` on the `EventMetaData` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventMetaData" DROP CONSTRAINT "EventMetaData_requestLogId_fkey";

-- AlterTable
ALTER TABLE "EventMetaData" DROP COLUMN "requestLogId";

-- CreateTable
CREATE TABLE "RequestLogEvent" (
    "id" TEXT NOT NULL,
    "requestLogId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,

    CONSTRAINT "RequestLogEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestLogEvent_requestLogId_eventName_key" ON "RequestLogEvent"("requestLogId", "eventName");

-- AddForeignKey
ALTER TABLE "RequestLogEvent" ADD CONSTRAINT "RequestLogEvent_requestLogId_fkey" FOREIGN KEY ("requestLogId") REFERENCES "RequestLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestLogEvent" ADD CONSTRAINT "RequestLogEvent_eventName_fkey" FOREIGN KEY ("eventName") REFERENCES "EventMetaData"("eventName") ON DELETE CASCADE ON UPDATE CASCADE;
