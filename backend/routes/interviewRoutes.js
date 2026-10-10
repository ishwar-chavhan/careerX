const express = require("express");
const router = express.Router();
const {interviewLimiter, feedbackLimiter} = require("../middlewares/RateLimitor");
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


router.post("/generateInterviewQuestion",auth, isUser,interviewLimiter, generateInterviewQuestion);
router.post("/getInterviewQuestion", auth, isUser,feedbackLimiter, getInterviewQuestion);
router.post("/getAIsFeedBack", auth, isUser, feedbackLimiter, getAIsFeedBack);
router.post("/getFeedbackByCount", auth, isUser,feedbackLimiter, getFeedbackByCount);
router.post("/getUserFeedbackData", auth, isUser,feedbackLimiter, getUserFeedbackData);
router.post("/getInterviewHistory", auth, isUser, getInterviewHistory);
router.post("/getInterviewResult", auth, isUser, getInterviewResult);


module.exports = router;