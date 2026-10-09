const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
    try {
        let transpoter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        let info = await transpoter.sendMail({
            from: `"Personal AI Coach || Ishwar Chavhan" <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        return info;

    } catch (error) {
        console.log("error in mail sender", error);
        throw new Error("something went wrong in mail sender");
    }
}

module.exports = mailSender;