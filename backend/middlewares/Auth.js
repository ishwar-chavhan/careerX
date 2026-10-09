const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.body?.token || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("token received ----->" , token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token is expired log in again"
            })
        }

        try {
            let decode = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decode;
        } catch (err) {
            console.log("error in verifying the token", err);
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }
        next();
    } catch (error) {
        console.log("error in auth middlewares", error);
        return res.status(200).json({
            success: false,
            message: error.message
        })
    }
}


exports.isUser = async (req, res, next) => {
    try {
        // console.log("required is printed to verify" , req);
        if (req.userId.accountType !== "User") {
            return res.status(401).json({
                success: false,
                message: 'this is protected route for User Only'
            });
        }
        // console.log("passed ?")
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified please try again"
        });

    }
}



exports.isAdmin = async (req, res, next) => {
    try {
        if (req.userId.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: 'this is protected route for Admin Only'
            });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified please try again"
        });

    }
}



