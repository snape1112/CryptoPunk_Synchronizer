-- CreateTable
CREATE TABLE "CryptoTransfer" (
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "blockHash" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,

    CONSTRAINT "CryptoTransfer_pkey" PRIMARY KEY ("id")
);
