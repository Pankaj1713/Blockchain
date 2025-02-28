import { PrismaClient } from "@prisma/client";
import { sendManyByAddress } from "../services/transactionService.js";

const prisma = new PrismaClient();

export const sendAmount = async (req, res) => {
    try {
        const { sender, amount, addresses } = req.body;

        if (!amount) return res.status(400).json({ error: "Amount is required" });
        if (!addresses || !Array.isArray(addresses)) return res.status(400).json({ error: "Valid addresses array is required" });
        if (!sender) return res.status(400).json({ error: "Sender is required" });

        const recipients = Object.fromEntries(addresses.map(addr => [addr, amount]));

        const { data, success } = await sendManyByAddress(sender, recipients);

        if (!success) return res.status(400).json({ error: "Transaction failed", details: data });

        const transaction = await prisma.transaction.create({
            data: {
                trxHash: data,
                sender,
                amount,
                totalAmount: amount * addresses.length,
                addresses: { create: addresses.map(addr => ({ address: addr })) }
            },
            include: { addresses: true }
        });

        return res.status(200).json({ message: "Transaction successful", transaction });
    } catch (error) {
        console.error("Error in sendAmount:", error);
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

export const getTransactionDetailById = async (req, res) => {
    try {
        const { trxHash } = req.params;
        const transaction = await prisma.transaction.findUnique({
            where: { trxHash },
            include: { addresses: true }
        });

        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        return res.status(200).json(transaction);
    } catch (error) {
        console.error("Error in getTransactionDetailById:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
