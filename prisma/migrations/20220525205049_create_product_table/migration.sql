-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "sell_price" DECIMAL(15,2) NOT NULL,
    "cost_prince" DECIMAL(15,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "reference_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_uid_key" ON "product"("uid");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "reference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
