import { PrismaClient } from "@prisma/client";
import { sendOTP } from "../helpers/emailHelper.js";
import { getAddressBalance, getNewAddress } from "../services/userService.js";

const prisma = new PrismaClient();
const otpStorage = new Map(); 

export const createUser = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
        if (process.env.NODE_ENV === "test") {
            await prisma.user.delete({ where: { email } });
        } else {
            return res.status(400).json({ message: "User already exists" });
        }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage.set(email, otp);

    try {
        await sendOTP(email, otp);
        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error sending OTP" });
    }
};

export const verifyUser = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp)
        return res.status(400).json({ error: "All fields are required" });

    const storedOtp = otpStorage.get(email);
    if (!storedOtp || storedOtp !== otp) return res.status(400).json({ error: "Invalid OTP" });

    const address = await getNewAddress()
    if (!address) return res.status(400).json({ error: "Something went wrong, can not generate address" });
    try {
        const newUser = await prisma.user.create({
            data: { email, address }
        });

        otpStorage.delete(email);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
};

export const getUserDetails = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });
        const amount = await getAddressBalance(user.address)
        res.json({ ...user, amount });
    } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
    }
};


