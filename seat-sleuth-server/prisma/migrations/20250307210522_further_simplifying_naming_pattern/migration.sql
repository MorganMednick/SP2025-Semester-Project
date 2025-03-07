/*
  Warnings:

  - You are about to drop the `SpecifiEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PriceOption" DROP CONSTRAINT "PriceOption_eventOptionId_fkey";

-- DropForeignKey
ALTER TABLE "SpecifiEvent" DROP CONSTRAINT "SpecifiEvent_eventName_fkey";

-- DropForeignKey
ALTER TABLE "WatchedEvent" DROP CONSTRAINT "WatchedEvent_eventOptionId_fkey";

-- DropTable
DROP TABLE "SpecifiEvent";

-- CreateTable
CREATE TABLE "EventInstance" (
    "ticketMasterId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "seatMapSrc" TEXT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "url" TEXT,
    "currency" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "saleStart" TIMESTAMP(3),
    "saleEnd" TIMESTAMP(3),

    CONSTRAINT "EventInstance_pkey" PRIMARY KEY ("ticketMasterId")
);

-- AddForeignKey
ALTER TABLE "WatchedEvent" ADD CONSTRAINT "WatchedEvent_eventOptionId_fkey" FOREIGN KEY ("eventOptionId") REFERENCES "EventInstance"("ticketMasterId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceOption" ADD CONSTRAINT "PriceOption_eventOptionId_fkey" FOREIGN KEY ("eventOptionId") REFERENCES "EventInstance"("ticketMasterId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_eventName_fkey" FOREIGN KEY ("eventName") REFERENCES "EventMetaData"("eventName") ON DELETE CASCADE ON UPDATE CASCADE;
