-- AlterTable
ALTER TABLE "reference" ADD COLUMN     "measurement_unit" VARCHAR(50),
ADD COLUMN     "measurement_value" DOUBLE PRECISION,
ADD COLUMN     "packaging" VARCHAR(50);
