-- CreateEnum (safe: no-op if already exists with same values)
DO $$ BEGIN
    CREATE TYPE "BC_UserRole" AS ENUM ('USER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable BC_User
CREATE TABLE IF NOT EXISTS "BC_User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "BC_UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BC_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable BC_Account
CREATE TABLE IF NOT EXISTS "BC_Account" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "ext_expires_in" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "BC_Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable BC_Session
CREATE TABLE IF NOT EXISTS "BC_Session" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BC_Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable BC_Template
CREATE TABLE IF NOT EXISTS "BC_Template" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "svgFile" TEXT NOT NULL,
    "thumbnail" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BC_Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable BC_BusinessCard
CREATE TABLE IF NOT EXISTS "BC_BusinessCard" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "division" TEXT,
    "office" TEXT,
    "address" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BC_BusinessCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "BC_User_email_key" ON "BC_User"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "BC_Account_provider_providerAccountId_key" ON "BC_Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "BC_Session_sessionToken_key" ON "BC_Session"("sessionToken");

-- AddForeignKey
ALTER TABLE "BC_Account" ADD CONSTRAINT "BC_Account_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "BC_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    NOT VALID;
ALTER TABLE "BC_Account" VALIDATE CONSTRAINT "BC_Account_userId_fkey";

-- AddForeignKey
ALTER TABLE "BC_Session" ADD CONSTRAINT "BC_Session_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "BC_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    NOT VALID;
ALTER TABLE "BC_Session" VALIDATE CONSTRAINT "BC_Session_userId_fkey";

-- AddForeignKey
ALTER TABLE "BC_BusinessCard" ADD CONSTRAINT "BC_BusinessCard_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "BC_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    NOT VALID;
ALTER TABLE "BC_BusinessCard" VALIDATE CONSTRAINT "BC_BusinessCard_userId_fkey";

-- AddForeignKey
ALTER TABLE "BC_BusinessCard" ADD CONSTRAINT "BC_BusinessCard_templateId_fkey"
    FOREIGN KEY ("templateId") REFERENCES "BC_Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    NOT VALID;
ALTER TABLE "BC_BusinessCard" VALIDATE CONSTRAINT "BC_BusinessCard_templateId_fkey";
