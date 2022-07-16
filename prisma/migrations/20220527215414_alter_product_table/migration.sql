/*
  Warnings:

  - You are about to drop the column `cost_prince` on the `product` table. All the data in the column will be lost.
  - Added the required column `cost_price` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "cost_prince",
ADD COLUMN     "cost_price" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "sale_price" DECIMAL(15,2);
