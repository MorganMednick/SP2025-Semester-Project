/*
  Warnings:

  - The primary key for the `RequestLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[eventName]` on the table `RequestLog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RequestLog" DROP CONSTRAINT "RequestLog_pkey",
ADD CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("eventName");

-- CreateIndex
CREATE UNIQUE INDEX "RequestLog_eventName_key" ON "RequestLog"("eventName");
