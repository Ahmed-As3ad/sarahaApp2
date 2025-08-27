import nodemailer from 'nodemailer'

export const sendMail = async ({ to = "", subject = "", html = "" }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: "ahmed.as3ad48@gmail.com",
            pass: "gnnl jerg tjrf vcbc",
        },
    });

    const info = await transporter
        .sendMail({
            from: "Saraha App <ahmed.as3ad48@gmail.com>",
            to,
            subject,
            html,
        });

    // console.log("✅ Message sent: %s", info.messageId);
    return info;
}




