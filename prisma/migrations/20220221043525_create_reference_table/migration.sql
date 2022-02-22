-- CreateTable
CREATE TABLE "reference" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(250),
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reference_uid_key" ON "reference"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "reference_sku_key" ON "reference"("sku");

-- AddForeignKey
ALTER TABLE "reference" ADD CONSTRAINT "reference_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
