-- CreateEnum
CREATE TYPE "PriceOptionSource" AS ENUM ('Ticketmaster', 'Stubhub', 'Seatgeek');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "notification" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchedEvent" (
    "userId" INTEGER NOT NULL,
    "eventInstanceId" TEXT NOT NULL,

    CONSTRAINT "WatchedEvent_pkey" PRIMARY KEY ("userId","eventInstanceId")
);

-- CreateTable
CREATE TABLE "PriceOption" (
    "id" TEXT NOT NULL,
    "eventInstanceId" TEXT NOT NULL,
    "priceMin" DOUBLE PRECISION NOT NULL,
    "priceMax" DOUBLE PRECISION NOT NULL,
    "source" "PriceOptionSource" NOT NULL,

    CONSTRAINT "PriceOption_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "EventMetaData" (
    "eventName" TEXT NOT NULL,
    "genre" TEXT,
    "coverImage" TEXT,
    "instanceCount" INTEGER NOT NULL,

    CONSTRAINT "EventMetaData_pkey" PRIMARY KEY ("eventName")
);

-- CreateTable
CREATE TABLE "RequestLog" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "queryParams" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestLogEvent" (
    "id" TEXT NOT NULL,
    "requestLogId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,

    CONSTRAINT "RequestLogEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PriceOption_eventInstanceId_source_key" ON "PriceOption"("eventInstanceId", "source");

-- CreateIndex
CREATE UNIQUE INDEX "EventMetaData_eventName_key" ON "EventMetaData"("eventName");

-- CreateIndex
CREATE UNIQUE INDEX "RequestLog_queryParams_key" ON "RequestLog"("queryParams");

-- CreateIndex
CREATE UNIQUE INDEX "RequestLogEvent_requestLogId_eventName_key" ON "RequestLogEvent"("requestLogId", "eventName");

-- AddForeignKey
ALTER TABLE "WatchedEvent" ADD CONSTRAINT "WatchedEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedEvent" ADD CONSTRAINT "WatchedEvent_eventInstanceId_fkey" FOREIGN KEY ("eventInstanceId") REFERENCES "EventInstance"("ticketMasterId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceOption" ADD CONSTRAINT "PriceOption_eventInstanceId_fkey" FOREIGN KEY ("eventInstanceId") REFERENCES "EventInstance"("ticketMasterId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_eventName_fkey" FOREIGN KEY ("eventName") REFERENCES "EventMetaData"("eventName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestLogEvent" ADD CONSTRAINT "RequestLogEvent_requestLogId_fkey" FOREIGN KEY ("requestLogId") REFERENCES "RequestLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestLogEvent" ADD CONSTRAINT "RequestLogEvent_eventName_fkey" FOREIGN KEY ("eventName") REFERENCES "EventMetaData"("eventName") ON DELETE CASCADE ON UPDATE CASCADE;
