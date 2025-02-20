import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";

dotenv.config();

const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const sendOTP = async (email, otp) => {
    if (!process.env.EMAIL_SENDER) {
        throw new Error("EMAIL_SENDER is not set in environment variables");
    }

    const params = {
        Source: process.env.EMAIL_SENDER, 
        Destination: { ToAddresses: [email] },
        Message: {
            Subject: { Data: "Your OTP Code" },
            Body: { Text: { Data: `Your OTP code is: ${otp}. It will expire in 10 minutes.` } },
        },
    };

    try {
        await sesClient.send(new SendEmailCommand(params));
    } catch (error) {
        console.error(`❌ Error sending email: ${error.message}`);
        throw error;
    }
};
