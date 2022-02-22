-- CreateTable
CREATE TABLE "reference_attachment" (
    "reference_id" INTEGER NOT NULL,
    "attachment_id" INTEGER NOT NULL,
    "main" BOOLEAN DEFAULT false,
    "version" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reference_attachment_pkey" PRIMARY KEY ("reference_id","attachment_id")
);

-- AddForeignKey
ALTER TABLE "reference_attachment" ADD CONSTRAINT "reference_attachment_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_attachment" ADD CONSTRAINT "reference_attachment_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "reference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
