/*
  Warnings:

  - You are about to drop the `_EventToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventToUser" DROP CONSTRAINT "_EventToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToUser" DROP CONSTRAINT "_EventToUser_B_fkey";

-- DropTable
DROP TABLE "_EventToUser";

-- CreateTable
CREATE TABLE "UserWatchlist" (
    "user_id" INTEGER NOT NULL,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "UserWatchlist_pkey" PRIMARY KEY ("user_id","event_id")
);

-- AddForeignKey
ALTER TABLE "UserWatchlist" ADD CONSTRAINT "UserWatchlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWatchlist" ADD CONSTRAINT "UserWatchlist_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
