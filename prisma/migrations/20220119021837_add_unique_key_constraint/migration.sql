/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Channel_key_key" ON "Channel"("key");
