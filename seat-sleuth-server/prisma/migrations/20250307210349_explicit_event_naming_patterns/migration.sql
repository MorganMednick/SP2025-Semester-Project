/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventOption" DROP CONSTRAINT "EventOption_eventName_fkey";

-- DropForeignKey
ALTER TABLE "PriceOption" DROP CONSTRAINT "PriceOption_eventOptionId_fkey";

-- DropForeignKey
ALTER TABLE "WatchedEvent" DROP CONSTRAINT "WatchedEvent_eventOptionId_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "EventOption";

-- CreateTable
CREATE TABLE "SpecifiEvent" (
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

    CONSTRAINT "SpecifiEvent_pkey" PRIMARY KEY ("ticketMasterId")
);

-- CreateTable
CREATE TABLE "EventMetaData" (
    "eventName" TEXT NOT NULL,
    "genre" TEXT,
    "imageSrc" TEXT[],

    CONSTRAINT "EventMetaData_pkey" PRIMARY KEY ("eventName")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventMetaData_eventName_key" ON "EventMetaData"("eventName");

-- AddForeignKey
ALTER TABLE "WatchedEvent" ADD CONSTRAINT "WatchedEvent_eventOptionId_fkey" FOREIGN KEY ("eventOptionId") REFERENCES "SpecifiEvent"("ticketMasterId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceOption" ADD CONSTRAINT "PriceOption_eventOptionId_fkey" FOREIGN KEY ("eventOptionId") REFERENCES "SpecifiEvent"("ticketMasterId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecifiEvent" ADD CONSTRAINT "SpecifiEvent_eventName_fkey" FOREIGN KEY ("eventName") REFERENCES "EventMetaData"("eventName") ON DELETE CASCADE ON UPDATE CASCADE;
