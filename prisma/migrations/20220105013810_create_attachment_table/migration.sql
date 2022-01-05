-- CreateTable
CREATE TABLE "attachment" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "url" VARCHAR(250) NOT NULL,
    "cloudId" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attachment_uid_key" ON "attachment"("uid");
