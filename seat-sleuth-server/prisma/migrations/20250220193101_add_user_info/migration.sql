/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Notifications" AS ENUM ('EMAIL', 'OFF');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "notif" "Notifications" NOT NULL DEFAULT 'OFF';
