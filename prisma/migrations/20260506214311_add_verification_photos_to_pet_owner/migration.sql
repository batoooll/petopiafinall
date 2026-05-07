/*
  Warnings:

  - You are about to drop the column `idCardImage` on the `SitterProfile` table. All the data in the column will be lost.
  - You are about to drop the `SitterImage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[petOwnerProfileId]` on the table `SitterProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `petOwnerProfileId` to the `SitterProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SitterImage" DROP CONSTRAINT "SitterImage_sitterProfileId_fkey";

-- AlterTable
ALTER TABLE "PetOwnerProfile" ADD COLUMN     "idCardPhoto1" TEXT,
ADD COLUMN     "idCardPhoto2" TEXT,
ADD COLUMN     "locationPhoto1" TEXT,
ADD COLUMN     "locationPhoto2" TEXT,
ADD COLUMN     "verificationStatus" "SitterVerificationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "SitterProfile" DROP COLUMN "idCardImage",
ADD COLUMN     "petOwnerProfileId" TEXT NOT NULL;

-- DropTable
DROP TABLE "SitterImage";

-- CreateIndex
CREATE UNIQUE INDEX "SitterProfile_petOwnerProfileId_key" ON "SitterProfile"("petOwnerProfileId");

-- CreateIndex
CREATE INDEX "SitterProfile_petOwnerProfileId_idx" ON "SitterProfile"("petOwnerProfileId");

-- AddForeignKey
ALTER TABLE "SitterProfile" ADD CONSTRAINT "SitterProfile_petOwnerProfileId_fkey" FOREIGN KEY ("petOwnerProfileId") REFERENCES "PetOwnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
