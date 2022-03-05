-- CreateTable
CREATE TABLE "business" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(10) NOT NULL,
    "address" VARCHAR(250) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_uid_key" ON "business"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "business_name_key" ON "business"("name");

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
