/*
  Warnings:

  - You are about to drop the column `channelKey` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `values` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `valuesUpdatedAt` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "channelKey",
DROP COLUMN "values",
DROP COLUMN "valuesUpdatedAt";

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_projectId_key" ON "Channel"("projectId");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
