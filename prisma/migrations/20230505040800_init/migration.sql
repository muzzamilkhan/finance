-- CreateTable
CREATE TABLE "Particulars" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recurring" TEXT NOT NULL,
    "date" INTEGER NOT NULL,

    CONSTRAINT "Particulars_pkey" PRIMARY KEY ("id")
);
