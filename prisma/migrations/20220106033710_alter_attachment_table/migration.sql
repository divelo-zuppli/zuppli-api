/*
  Warnings:

  - You are about to drop the column `cloudId` on the `attachment` table. All the data in the column will be lost.
  - Added the required column `cloud_id` to the `attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachment" DROP COLUMN "cloudId",
ADD COLUMN     "cloud_id" VARCHAR(50) NOT NULL;
