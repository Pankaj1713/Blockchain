import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Example: "smtp.gmail.com"
    port: process.env.SMTP_PORT, // 465 (SSL) or 587 (TLS)
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendOTP = async (email, otp, sender = null) => {
    if (!process.env.EMAIL_SENDER) {
        throw new Error("EMAIL_SENDER is not set in environment variables");
    }

    // Construct email message
    const subject = sender ? "Transaction OTP Verification" : "Your OTP Code";
    const message = sender
        ? `Your OTP code is: ${otp}. It will expire in 10 minutes. Sender: ${sender}. Please verify if this transaction is initiated by you.`
        : `Your OTP code is: ${otp}. It will expire in 10 minutes.`;

    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: email,
        subject,
        text: message,
    };
   

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${email}`);
    } catch (error) {
        console.error(`❌ Error sending email: ${error.message}`);
        throw error;
    }
};
