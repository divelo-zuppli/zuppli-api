-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(10) NOT NULL,
    "auth_uid" VARCHAR(100) NOT NULL,
    "full_name" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_uid_key" ON "user"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_number_key" ON "user"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_uid_key" ON "user"("auth_uid");
