import otpGenerator from 'otp-generator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateOTP = async (email) => {
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

    await prisma.OTP.upsert({
        where: { email },
        update: { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }, 
        create: { email, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    });

    return otp;
};

export const verifyOTP = async (email, otp) => {
    const record = await prisma.OTP.findUnique({ where: { email } });

    if (!record || record.otp !== otp || new Date() > record.expiresAt) {
        return false;
    }

    await prisma.OTP.delete({ where: { email } }); 
    return true;
};
