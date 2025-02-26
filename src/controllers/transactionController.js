import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const otpStorage = new Map(); 
const ownerEmail = process.env.OWNER_EMAIL;

export const sendAmount = async (req, res) => {
    try {
        const { amount, addresses } = req.body;

        if (!amount) return res.status(400).json({ error: "Amount is required" });
        if (!addresses || !Array.isArray(addresses)) {
            return res.status(400).json({ error: "Valid addresses array is required" });
        }

        // Fetch owner details
        const owner = await prisma.user.findUnique({ where: { email: ownerEmail } });

        if (!owner) return res.status(404).json({ error: "Owner not found" });
       
        const {data, success} = await sendBitcoin(amount,addresses )
        if(success){
            res.json({ message: "Transaction successful", transactionId: data });
        }
        res.status(400).json({ error: "Transaction failed", details: data });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
