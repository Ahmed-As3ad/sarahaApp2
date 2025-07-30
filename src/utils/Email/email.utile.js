import nodemailer from 'nodemailer'
export const sendMail = async () => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: "ahmed.as3ad48@gmail.com",
            pass: "gnnl jerg tjrf vcbc",
        },
    });

    await transporter
        .sendMail({
            from: "SyntaxDev <ahmed.as3ad48@gmail.com>",
            to: "anaahmee48@gmail.com",
            subject: "Hello from tests ✔",
            text: "This message was sent from a Node.js integration test.",
        })
    console.log("Message sent: %s", info.messageId);

}




