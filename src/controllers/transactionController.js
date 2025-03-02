import { PrismaClient } from "@prisma/client";
import { getTransactionByHash, sendManyByAddress } from "../services/transactionService.js";

const prisma = new PrismaClient();
const mapStorage = new Map(); // Temporary storage for transactions before verification

export const sendAmount = async (req, res) => {
    try {
        const { sender, amount, addresses, otp } = req.body;

        if (!sender) return res.status(400).json({ error: "Sender is required" });
        if (!amount) return res.status(400).json({ error: "Amount is required" });
        if (!addresses || !Array.isArray(addresses)) return res.status(400).json({ error: "Valid addresses array is required" });

        // Store transaction details in mapStorage for verification
        mapStorage.set(sender, { sender, amount, addresses, otp });

        return res.status(200).json({
            message: "Transaction created. Please verify with the OTP sent to your email."
        });
    } catch (error) {
        console.error("Error in sendAmount:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const verifyTransaction = async (req, res) => {
    try {
        const { sender, otp } = req.body;
        if (!sender) return res.status(400).json({ error: "Sender is required" });
        if (!otp) return res.status(400).json({ error: "OTP is required" });

        // Retrieve transaction data from storage
        const storedTransaction = mapStorage.get(sender);
        if (!storedTransaction) return res.status(400).json({ error: "Transaction not found or expired" });

        const { amount, addresses, storedOtp } = storedTransaction;

        // OTP validation
        if (otp !== storedOtp) return res.status(400).json({ error: "Invalid OTP" });

        const recipients = Object.fromEntries(addresses.map(addr => [addr, amount]));

        // Execute the transaction
        const { data, success } = await sendManyByAddress(sender, recipients);

        if (!success) return res.status(400).json({ error: "Transaction failed", details: data });

        // Store transaction in the database after successful verification
        const transaction = await prisma.transaction.create({
            data: {
                sender,
                amount,
                totalAmount: amount * addresses.length,
                trxHash: data,
                addresses: {
                    create: addresses.map(addr => ({ address: addr }))
                }
            },
            include: { addresses: true }
        });

        // Remove from temporary storage after successful transaction
        mapStorage.delete(sender);

        return res.status(200).json({
            message: "Transaction successful",
            transaction
        });
    } catch (error) {
        console.error("Error in verifyTransaction:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const getTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [transactions, totalTransactions] = await Promise.all([
            prisma.transaction.findMany({
                include: { addresses: true },
                orderBy: { date: 'desc' },
                skip,
                take: limit
            }),
            prisma.transaction.count()
        ]);

        return res.status(200).json({
            transactions,
            currentPage: page,
            totalPages: Math.ceil(totalTransactions / limit),
            totalTransactions
        });
    } catch (error) {
        console.error("Error in getTransactions:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getTransactionDetailByHash = async (req, res) => {
    try {
        const { trxHash } = req.params;

        // Fetch transaction details from Bitcoin Regtest Node
        const transaction = await getTransactionByHash(trxHash);

        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        return res.status(200).json(transaction);
    } catch (error) {
        console.error("Error fetching transaction from Bitcoin Regtest:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};