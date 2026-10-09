const User = require("../models/User");
const otpGenerator = require("otp-generator");
const OTPs = require("../models/OTP");
const AdditionalDetail = require("../models/AdditionalDetails");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

exports.OtpSend = async (req, res) => {
    try {
        // console.log("1")
        const { email } = req.body;
        console.log("reach at level 1");
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })

        // console.log("reach at level 2");
        //  console.log("2")
        const otpBody = await OTPs.create({
            email: email,
            otp: otp,
        });
        // console.log("reach at level 3");
        //  console.log("3")
        res.status(200).json({
            success: true,
            message: "OTP Sent Successfully"
        })
    } catch (err) {
        console.log("error", err);
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
        } = req.body;
        // console.log("otp -------->" , otp)
         console.log("reach at level 1");
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(404).json({
                success: false,
                message: "field data is missing try again later"
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password is not matching"
            })
        }
       console.log("reach at level 2");
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(300).json({
                success: false,
                message: "user exist please log in"
            })
        }
     console.log("reach at level 3");
        const recentOtp = await OTPs.findOne({ email }).sort({ createdAt: -1 });
        if (!recentOtp) {
            return res.status(404).json({
                success: false,
                message: "OTP not found"
            })
        }
        // console.log("recentOtp -------->" , recentOtp.otp)
        if (recentOtp.otp !== otp) {
            return res.status(404).json({
                success: false,
                message: "otp not matched"
            })
        }
        console.log("reach at level 4");

        const hashedPassword = await bcrypt.hash(password, 10);
        // const profileAddDetails = await AdditionalDetail.create({
        //     contactNumber: 0,
        //     dateOfBirth: "empty",
        //     gender: "empty",
        //     about: "empty"
        // })
       console.log("reach at level 5");
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            // additionalDetails: profileAddDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`

        })
console.log("reach at level 7");
        return res.status(200).json({
            success: true,
            message: "user is registered success fully"
        })

    } catch (error) {
        console.log("error in sign up", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "please enter all detail and try again later"
            })
        }

        const user = await User.findOne({ email }).populate("additionalDetails").exec();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not exist please sign up first"
            })
        }
            if (!user.password) {
             return res.status(400).json({ success: false, message: "This account uses Google sign-in" });
            }

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "5h"
            });

            user.token = token
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 23 * 60 * 60 * 1000),
                httpOnly: true,
            }

            return res.status(200).cookie("token", token, options).json({
                success: true,
                token: token,
                user: user,
                message: "logged in successfully"
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "password is incorrect"
            })
        }
    } catch (error) {
        console.log("error in login", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
               console.log("reach at level 1");
        const userId = req.userId.id;
        if (!newPassword || !confirmNewPassword) {
            return res.status(404).json({
                success : false,
                message : "all field are required"
            })
        }
               console.log("reach at level 2");
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "user doesnt exist"
            })
        }
               console.log("reach at level 3");

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "password and confirm password doesnt match"
            });
        };

               console.log("reach at level 4");
        if (await bcrypt.compare(oldPassword, userDetails.password)) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const userDetails = await User.findByIdAndUpdate(userId,
                {
                    password: hashedPassword
                },
                {
                    new: true
                }
            );
               console.log("reach at level 6");
        } else {
            return res.status(400).json({
                success: false,
                message: "wrong old password"
            })
        }

               console.log("reach at level 5");
        return res.status(200).json({
            success: true,
            message: "password changed success fully"
        })
    } catch (error) {
        console.log("error in change password", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "google credentials is required"
            })
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload();
        const {
            sub: googleId,
            email,
            email_verified,
            name,
            picture
        } = payload;

        if (!email_verified) {
            return res.status(401).json({
                success: false,
                message: "google email is not verified"
            })
        }

        let userExist = await User.findOne({ email: email });

        if (!userExist) {
            const nameParts = name ? name.split(" ") : [];
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            // const profileAddDetails = await AdditionalDetail.create({
            //     contactNumber: null,
            //     dateOfBirth: null,
            //     gender: null,
            //     about: null
            // })


            userExist = await User.create({
                firstName,
                lastName,
                email,
                googleId: googleId,
                // additionalDetails: profileAddDetails._id,
                image: picture ? picture : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
            })
        }

        else if (!userExist.googleId) {
            userExist.googleId = googleId;

            if (!userExist.image && picture) {
                userExist.image = picture;
            }

            await userExist.save();
        }

        const jwtPayload = {
            email: userExist.email,
            id: userExist._id,
            accountType: userExist.accountType
        }
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
            expiresIn: "5h"
        });

        userExist.token = token
        userExist.password = undefined;

        const options = {
            expires: new Date(Date.now() + 5 * 60 * 60 * 1000),
            httpOnly: true,
        }

        return res.status(200).cookie("token", token, options).json({
            success: true,
            token: token,
            user: userExist,
            message: "logged in successfully"
        })



    } catch (error) {
        console.log("error in google login and sign up", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
