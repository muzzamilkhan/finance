-- CreateTable
CREATE TABLE "Overrides" (
    "id" SERIAL NOT NULL,
    "particulars_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Overrides_pkey" PRIMARY KEY ("id")
);
