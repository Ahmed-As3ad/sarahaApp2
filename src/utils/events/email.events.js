import { EventEmitter } from 'node:events';
import { sendMail } from '../Email/email.utile.js';
export const emailEvent = new EventEmitter();

emailEvent.on("confirm-Email", async (data) => {
    try {

        await sendMail({
            to: data.to,
            subject: data?.subject || "Email Confirmation - OTP Code ✔",
            html: data?.html || `
            <div style="padding: 20px 25px 10px; text-align: center;">
                        <div style="font-size: 20px; color: #512d0b; font-weight: bold; margin: 10px 0;">
                            <strong>Hey ${data?.name || 'User'}!</strong>
                        </div>
                        
                        <div style="color: #489BDA; font-size: 25px; font-weight: bold; line-height: 35px; margin: 20px 0;">
                            Your OTP IS:<br>
                            <span style="font-size: 18px; color: #489BDA;">${data?.otp}</span>
                        </div>
                        
                        <div style="color: #000000; font-size: 14px; margin-top: 40px;">
                            Best,<br>
                            The Saraha App Team
                        </div>
            `
        });

        // console.log(`✅ Email sent successfully to ${data.to} with OTP: ${data?.otp}`);
        return data.otp;
    } catch (err) {
        // console.log(`❌ Failed to send confirm Email to ${data?.to}`);
        console.error("Email error:", err.message);
        throw err;
    }
});