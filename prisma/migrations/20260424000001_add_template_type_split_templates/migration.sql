-- CreateEnum BC_TemplateType
DO $$ BEGIN
    CREATE TYPE "BC_TemplateType" AS ENUM ('FRONT', 'BACK');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add type column to BC_Template
ALTER TABLE "BC_Template"
    ADD COLUMN IF NOT EXISTS "type" "BC_TemplateType" NOT NULL DEFAULT 'FRONT';

-- Drop old single-template FK and column from BC_BusinessCard
ALTER TABLE "BC_BusinessCard" DROP CONSTRAINT IF EXISTS "BC_BusinessCard_templateId_fkey";
ALTER TABLE "BC_BusinessCard" DROP COLUMN IF EXISTS "templateId";

-- Add frontTemplateId and backTemplateId
ALTER TABLE "BC_BusinessCard"
    ADD COLUMN IF NOT EXISTS "frontTemplateId" TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS "backTemplateId"  TEXT NOT NULL DEFAULT '';

-- Remove temporary defaults
ALTER TABLE "BC_BusinessCard"
    ALTER COLUMN "frontTemplateId" DROP DEFAULT,
    ALTER COLUMN "backTemplateId"  DROP DEFAULT;

-- AddForeignKey for frontTemplateId
ALTER TABLE "BC_BusinessCard" DROP CONSTRAINT IF EXISTS "BC_BusinessCard_frontTemplateId_fkey";
ALTER TABLE "BC_BusinessCard" ADD CONSTRAINT "BC_BusinessCard_frontTemplateId_fkey"
    FOREIGN KEY ("frontTemplateId") REFERENCES "BC_Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey for backTemplateId
ALTER TABLE "BC_BusinessCard" DROP CONSTRAINT IF EXISTS "BC_BusinessCard_backTemplateId_fkey";
ALTER TABLE "BC_BusinessCard" ADD CONSTRAINT "BC_BusinessCard_backTemplateId_fkey"
    FOREIGN KEY ("backTemplateId") REFERENCES "BC_Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
