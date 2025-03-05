/*
  Warnings:

  - You are about to drop the column `city` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `priceMax` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `priceMin` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `saleEnd` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `saleStart` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `seatLocation` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `venueAddressOne` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `venueAddressTwo` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `venueName` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `venueSeatMapSrc` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `UserWatchlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WatchedPrice` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[eventName]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventName` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OptionSource" AS ENUM ('Ticketmaster', 'Stubhub', 'Seatgeek');

-- DropForeignKey
ALTER TABLE "UserWatchlist" DROP CONSTRAINT "UserWatchlist_event_id_fkey";

-- DropForeignKey
ALTER TABLE "UserWatchlist" DROP CONSTRAINT "UserWatchlist_user_id_fkey";

-- DropForeignKey
ALTER TABLE "WatchedPrice" DROP CONSTRAINT "WatchedPrice_watchlistId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "currency",
DROP COLUMN "name",
DROP COLUMN "priceMax",
DROP COLUMN "priceMin",
DROP COLUMN "saleEnd",
DROP COLUMN "saleStart",
DROP COLUMN "seatLocation",
DROP COLUMN "startTime",
DROP COLUMN "url",
DROP COLUMN "venueAddressOne",
DROP COLUMN "venueAddressTwo",
DROP COLUMN "venueName",
DROP COLUMN "venueSeatMapSrc",
ADD COLUMN     "eventName" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserWatchlist";

-- DropTable
DROP TABLE "WatchedPrice";

-- DropEnum
DROP TYPE "TicketSites";

-- CreateTable
CREATE TABLE "WatchedEvent" (
    "userId" INTEGER NOT NULL,
    "eventOptionId" TEXT NOT NULL,

    CONSTRAINT "WatchedEvent_pkey" PRIMARY KEY ("userId","eventOptionId")
);

-- CreateTable
CREATE TABLE "PriceOption" (
    "id" TEXT NOT NULL,
    "eventOptionId" TEXT NOT NULL,
    "priceMin" DOUBLE PRECISION NOT NULL,
    "priceMax" DOUBLE PRECISION NOT NULL,
    "source" "OptionSource" NOT NULL,

    CONSTRAINT "PriceOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventOption" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
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

    CONSTRAINT "EventOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceOption_eventOptionId_source_key" ON "PriceOption"("eventOptionId", "source");

-- CreateIndex
CREATE UNIQUE INDEX "Event_eventName_key" ON "Event"("eventName");

-- AddForeignKey
ALTER TABLE "WatchedEvent" ADD CONSTRAINT "WatchedEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedEvent" ADD CONSTRAINT "WatchedEvent_eventOptionId_fkey" FOREIGN KEY ("eventOptionId") REFERENCES "EventOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceOption" ADD CONSTRAINT "PriceOption_eventOptionId_fkey" FOREIGN KEY ("eventOptionId") REFERENCES "EventOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOption" ADD CONSTRAINT "EventOption_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
