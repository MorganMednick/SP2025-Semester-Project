/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Event` table. All the data in the column will be lost.
  - The primary key for the `EventOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `eventId` on the `EventOption` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `EventOption` table. All the data in the column will be lost.
  - Added the required column `eventName` to the `EventOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketMasterId` to the `EventOption` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventOption" DROP CONSTRAINT "EventOption_eventId_fkey";

-- DropForeignKey
ALTER TABLE "PriceOption" DROP CONSTRAINT "PriceOption_eventOptionId_fkey";

-- DropForeignKey
ALTER TABLE "WatchedEvent" DROP CONSTRAINT "WatchedEvent_eventOptionId_fkey";

-- DropIndex
DROP INDEX "Event_id_key";

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("eventName");

-- AlterTable
ALTER TABLE "EventOption" DROP CONSTRAINT "EventOption_pkey",
DROP COLUMN "eventId",
DROP COLUMN "id",
ADD COLUMN     "eventName" TEXT NOT NULL,
ADD COLUMN     "ticketMasterId" TEXT NOT NULL,
ADD CONSTRAINT "EventOption_pkey" PRIMARY KEY ("ticketMasterId");

-- AddForeignKey
ALTER TABLE "WatchedEvent" ADD CONSTRAINT "WatchedEvent_eventOptionId_fkey" FOREIGN KEY ("eventOptionId") REFERENCES "EventOption"("ticketMasterId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceOption" ADD CONSTRAINT "PriceOption_eventOptionId_fkey" FOREIGN KEY ("eventOptionId") REFERENCES "EventOption"("ticketMasterId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOption" ADD CONSTRAINT "EventOption_eventName_fkey" FOREIGN KEY ("eventName") REFERENCES "Event"("eventName") ON DELETE CASCADE ON UPDATE CASCADE;
