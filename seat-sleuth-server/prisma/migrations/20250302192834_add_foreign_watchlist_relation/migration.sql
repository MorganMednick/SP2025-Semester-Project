/*
  Warnings:

  - The primary key for the `UserWatchlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_id,event_id]` on the table `UserWatchlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TicketSites" AS ENUM ('TICKETMASTER', 'STUBHUB', 'SEATGEEK');

-- AlterTable
ALTER TABLE "UserWatchlist" DROP CONSTRAINT "UserWatchlist_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "watchStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "UserWatchlist_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "WatchedPrice" (
    "id" SERIAL NOT NULL,
    "startingPrice" DOUBLE PRECISION NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "ticketSite" "TicketSites" NOT NULL,
    "watchlistId" INTEGER NOT NULL,

    CONSTRAINT "WatchedPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WatchedPrice_watchlistId_key" ON "WatchedPrice"("watchlistId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWatchlist_user_id_event_id_key" ON "UserWatchlist"("user_id", "event_id");

-- AddForeignKey
ALTER TABLE "WatchedPrice" ADD CONSTRAINT "WatchedPrice_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "UserWatchlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
