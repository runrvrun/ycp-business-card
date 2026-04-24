-- CreateTable BC_Office
CREATE TABLE IF NOT EXISTS "BC_Office" (
    "id"        TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
    "name"      TEXT        NOT NULL,
    "address"   TEXT,
    "phone"     TEXT,
    "website"   TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BC_Office_pkey" PRIMARY KEY ("id")
);

-- Add officeId to BC_BusinessCard
ALTER TABLE "BC_BusinessCard"
    ADD COLUMN IF NOT EXISTS "officeId" TEXT;

-- AddForeignKey
ALTER TABLE "BC_BusinessCard" DROP CONSTRAINT IF EXISTS "BC_BusinessCard_officeId_fkey";
ALTER TABLE "BC_BusinessCard" ADD CONSTRAINT "BC_BusinessCard_officeId_fkey"
    FOREIGN KEY ("officeId") REFERENCES "BC_Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;
