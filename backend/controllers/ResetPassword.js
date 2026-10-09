const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

require("dotenv").config(); 
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;
        const userDetails = await User.findOne({ email: email });
        if (!userDetails) {
            return res.status(403).json({
                success: false,
                message: "user not found"
            })
        };
        const token = crypto.randomUUID();
        const updateUserDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5  * 60 * 1000
            },
            {
                new: true
            }
        )

        const URL = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        await mailSender(email, "reset password link", `reset password url : ${URL}`);

        return res.status(200).json({
            success: true,
            message: "reset email successfully sent on your email"
        })
    } catch (error) {
        console.log("error in generating reset pasword token", error);
        return res.status(500).json({
            success: false,
            message: "could not generated token for reset password"
        })
    }
}



exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;
        if (!password || !confirmPassword || !token) {
            return res.status(400).json({
                success: false,
                message: "all field required"
            })
        }

        const userDetails = await User.findOne({ token: token });
        if (!userDetails) {
            return res.json({
                success: false,
                message: "user not found"
            })
        }

        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "token is expired please regenerated your token"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("reached at this level")
        await User.findOneAndUpdate(
            { token: token },
            { 
                password: hashedPassword, 
                token: undefined,
                resetPasswordExpires: undefined
            },
            {
                new: true,
            }
        );
        

        // await mailSender(email, "password mail", "you have successfully reset your password");

        return res.status(200).json({
            success: true,
            message: "password is changed"
        })

    } catch (error) {
        console.log("error in reset password", error);
        return res.status(500).json({
            success: false,
            message: "error while  reseting passwrod"
        })

    }
}
