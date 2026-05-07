-- CreateTable
CREATE TABLE "SitterImage" (
    "id" TEXT NOT NULL,
    "sitterProfileId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SitterImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SitterImage_storageKey_key" ON "SitterImage"("storageKey");

-- CreateIndex
CREATE INDEX "SitterImage_sitterProfileId_idx" ON "SitterImage"("sitterProfileId");

-- AddForeignKey
ALTER TABLE "SitterImage" ADD CONSTRAINT "SitterImage_sitterProfileId_fkey" FOREIGN KEY ("sitterProfileId") REFERENCES "SitterProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SitterImage" ADD CONSTRAINT "SitterImage_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
