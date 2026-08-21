-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'NOT_INFORMED');

-- CreateEnum
CREATE TYPE "ShirtSize" AS ENUM ('PP', 'P', 'M', 'G');

-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('GRANTED', 'DENIED');

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "familyLabel" TEXT,
    "zipCode" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdByUserId" TEXT NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guardian" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "relationship" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nickname" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "sex" "Sex" NOT NULL DEFAULT 'NOT_INFORMED',
    "school" TEXT,
    "schoolGrade" TEXT,
    "unitClass" TEXT,
    "allergies" TEXT,
    "foodRestriction" TEXT,
    "continuousMedication" BOOLEAN NOT NULL DEFAULT false,
    "medicationDetails" TEXT,
    "hasHealthCondition" BOOLEAN NOT NULL DEFAULT false,
    "healthConditionDetails" TEXT,
    "specialAttentionNeeds" TEXT,
    "generalNotes" TEXT,
    "shirtSize" "ShirtSize",
    "eventDiscoveryChannel" TEXT,
    "imageConsent" "ConsentStatus" NOT NULL,
    "lgpdConsent" BOOLEAN NOT NULL,
    "checkedInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildInterest" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "activity" TEXT NOT NULL,

    CONSTRAINT "ChildInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorizedPickup" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "document" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthorizedPickup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RSVP" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RSVP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Family_city_idx" ON "Family"("city");

-- CreateIndex
CREATE INDEX "Family_state_idx" ON "Family"("state");

-- CreateIndex
CREATE INDEX "Family_zipCode_idx" ON "Family"("zipCode");

-- CreateIndex
CREATE INDEX "Guardian_fullName_idx" ON "Guardian"("fullName");

-- CreateIndex
CREATE INDEX "Guardian_cpf_idx" ON "Guardian"("cpf");

-- CreateIndex
CREATE INDEX "Guardian_phone_idx" ON "Guardian"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_familyId_cpf_key" ON "Guardian"("familyId", "cpf");

-- CreateIndex
CREATE INDEX "Child_fullName_idx" ON "Child"("fullName");

-- CreateIndex
CREATE INDEX "Child_birthDate_idx" ON "Child"("birthDate");

-- CreateIndex
CREATE INDEX "Child_checkedInAt_idx" ON "Child"("checkedInAt");

-- CreateIndex
CREATE INDEX "ChildInterest_activity_idx" ON "ChildInterest"("activity");

-- CreateIndex
CREATE INDEX "EmergencyContact_fullName_idx" ON "EmergencyContact"("fullName");

-- CreateIndex
CREATE INDEX "EmergencyContact_phone_idx" ON "EmergencyContact"("phone");

-- CreateIndex
CREATE INDEX "AuthorizedPickup_fullName_idx" ON "AuthorizedPickup"("fullName");

-- CreateIndex
CREATE INDEX "RSVP_status_idx" ON "RSVP"("status");

-- AddForeignKey
ALTER TABLE "Guardian" ADD CONSTRAINT "Guardian_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildInterest" ADD CONSTRAINT "ChildInterest_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizedPickup" ADD CONSTRAINT "AuthorizedPickup_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RSVP" ADD CONSTRAINT "RSVP_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
