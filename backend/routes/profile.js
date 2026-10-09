const express = require("express");
const router = express.Router();
const {aiResumeLimiter , otpLimitor} = require("../middlewares/RateLimitor")

const {
    OtpSend,
    signUp,
    login,
    changePassword,
    googleLogin,
} = require("../controllers/Auth");

const {
    updateUserInfo,
    updateProfilePicture
} = require("../controllers/profile");

const {
    resetPassword,
    resetPasswordToken
} = require("../controllers/ResetPassword");

const {
    auth, isUser, isAdmin
} = require("../middlewares/Auth");

router.post("/resetPassword",aiResumeLimiter, resetPassword);
router.post("/resetPasswordToken", aiResumeLimiter,resetPasswordToken);

router.post("/OtpSend",otpLimitor ,OtpSend);
router.post("/signUp",aiResumeLimiter, signUp);
router.post("/login",aiResumeLimiter, login);
router.post("/changePassword", auth, isUser, changePassword);
router.post("/googleLogin",aiResumeLimiter, googleLogin);

router.post("/updateProfilePicture", auth, isUser, updateProfilePicture);
router.post("/updateUserInfo", auth, isUser, updateUserInfo);

module.exports = router;