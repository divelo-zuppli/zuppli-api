-- CreateTable
CREATE TABLE "category_attachment" (
    "category_id" INTEGER NOT NULL,
    "attachment_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_attachment_pkey" PRIMARY KEY ("category_id","attachment_id")
);

-- AddForeignKey
ALTER TABLE "category_attachment" ADD CONSTRAINT "category_attachment_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attachment" ADD CONSTRAINT "category_attachment_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
