-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "trxHash" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionAddress" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "TransactionAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_trxHash_key" ON "Transaction"("trxHash");

-- AddForeignKey
ALTER TABLE "TransactionAddress" ADD CONSTRAINT "TransactionAddress_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
