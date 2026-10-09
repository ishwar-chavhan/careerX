const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },

    otp: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
        required: true,
    },
});

async function sendVerificationEmail(email, otp) {
    try {

        const htmlBody = `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                <h2 style="color: #333; text-align: center;">Your OTP Verification Code</h2>
                <p style="color: #555; text-align: center;">Use the code below to verify your email address for <strong>Personal AI Coach</strong>.</p>
                <div style="font-size: 36px; font-weight: bold; text-align: center; letter-spacing: 8px; color: #4f46e5; padding: 16px; background: #eef2ff; border-radius: 6px; margin: 24px 0;">
                    ${otp}
                </div>
                <p style="color: #888; font-size: 13px; text-align: center;">This code expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
                <p style="color: #bbb; font-size: 11px; text-align: center;">If you did not request this, please ignore this email.</p>
            </div>
        `;

        const mailResponse = await mailSender(
            email,
            "Your OTP Code - Personal AI Coach",
            htmlBody
        );
        console.log("Email sent successfully", mailResponse);

    } catch (err) {

        console.log(
            "Error in send verification email in OTP schema",
            err
        );
        throw err;

    }
}

OTPSchema.pre("save", async function () {
    try {
        await sendVerificationEmail(this.email, this.otp);
    } catch (err) {
        console.log("Error sending verification email:", err);
        throw err;
    }
});
module.exports = mongoose.model("OTPs", OTPSchema);