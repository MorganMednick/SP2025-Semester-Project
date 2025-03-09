/*
  Warnings:

  - You are about to drop the `TicketMasterRequestLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TicketMasterRequestLog";

-- CreateTable
CREATE TABLE "RequestLog" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "queryParams" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventName" TEXT NOT NULL,

    CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequestLog" ADD CONSTRAINT "RequestLog_eventName_fkey" FOREIGN KEY ("eventName") REFERENCES "EventMetaData"("eventName") ON DELETE CASCADE ON UPDATE CASCADE;
