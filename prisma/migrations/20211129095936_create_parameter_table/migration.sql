-- CreateTable
CREATE TABLE "parameter" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "parameter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parameter_name_key" ON "parameter"("name");
