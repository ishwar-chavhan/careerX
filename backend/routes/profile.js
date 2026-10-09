const express = require("express");
const router = express.Router();

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

router.post("/resetPassword", resetPassword);
router.post("/resetPasswordToken", resetPasswordToken);

router.post("/OtpSend", OtpSend);
router.post("/signUp", signUp);
router.post("/login", login);
router.post("/changePassword", auth, isUser, changePassword);
router.post("/googleLogin", googleLogin);

router.post("/updateProfilePicture", auth, isUser, updateProfilePicture);
router.post("/updateUserInfo", auth, isUser, updateUserInfo);

module.exports = router;