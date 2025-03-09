-- CreateTable
CREATE TABLE "TicketMasterRequestLog" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "queryParams" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketMasterRequestLog_pkey" PRIMARY KEY ("id")
);
