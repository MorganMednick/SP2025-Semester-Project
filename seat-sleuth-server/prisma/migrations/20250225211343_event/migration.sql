/*
  Warnings:

  - You are about to drop the column `watchlist` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "watchlist";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "priceMin" DOUBLE PRECISION,
    "priceMax" DOUBLE PRECISION,
    "currency" TEXT,
    "name" TEXT NOT NULL,
    "seatLocation" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "saleStart" TIMESTAMP(3),
    "saleEnd" TIMESTAMP(3),
    "venueName" TEXT,
    "venueAddressOne" TEXT,
    "venueAddressTwo" TEXT,
    "venueSeatMapSrc" TEXT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "url" TEXT,
    "genre" TEXT,
    "imageSrc" TEXT[],

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventToUser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EventToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EventToUser_B_index" ON "_EventToUser"("B");

-- AddForeignKey
ALTER TABLE "_EventToUser" ADD CONSTRAINT "_EventToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUser" ADD CONSTRAINT "_EventToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
