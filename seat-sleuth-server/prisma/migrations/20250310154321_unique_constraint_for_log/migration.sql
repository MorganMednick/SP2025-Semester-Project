/*
  Warnings:

  - A unique constraint covering the columns `[queryParams]` on the table `RequestLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RequestLog_queryParams_key" ON "RequestLog"("queryParams");
