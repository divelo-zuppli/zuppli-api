-- AlterTable
ALTER TABLE "category_attachment" ADD COLUMN     "main" BOOLEAN DEFAULT false,
ADD COLUMN     "version" VARCHAR(50);
