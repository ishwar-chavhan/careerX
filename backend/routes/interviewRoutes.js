const express = require("express");
const router = express.Router();
const {aiRateLimitor} = require("../middlewares/RateLimitor");
const {
    generateInterviewQuestion,
    getInterviewQuestion,
    getAIsFeedBack,
    getFeedbackByCount,
    getUserFeedbackData,
    getInterviewHistory,
    getInterviewResult
} = require("../controllers/AiController")


const {
    auth, isUser, isAdmin
} = require("../middlewares/Auth");


router.post("/generateInterviewQuestion",aiRateLimitor, auth, isUser, generateInterviewQuestion);
router.post("/getInterviewQuestion", auth, isUser, getInterviewQuestion);
router.post("/getAIsFeedBack", auth, isUser, getAIsFeedBack);
router.post("/getFeedbackByCount", auth, isUser, getFeedbackByCount);
router.post("/getUserFeedbackData", auth, isUser, getUserFeedbackData);
router.post("/getInterviewHistory", auth, isUser, getInterviewHistory);
router.post("/getInterviewResult", auth, isUser, getInterviewResult);


module.exports = router;