import nodemailer from 'nodemailer';
import Mail from "nodemailer/lib/mailer";


export async function sendMail(email: Mail.Options){
    const transporter = nodemailer.createTransport({
        service: "Outlook365",
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASSWORD
        },
        port:parseInt(process.env.MAILER_PORT),
        host:process.env.MAILER_HOST,
        secure: false
    });
    await transporter.sendMail(email);
}
