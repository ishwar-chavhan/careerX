const { rateLimit } = require("express-rate-limit");
const RateLimitor = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "too many request please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false,
})



const aiResumeLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: "Too many requests. Try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const aiRateLimitor = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    message: {
        success: false,
        message: "Too many requests. Try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
})


const otpLimitor = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    message: {
        success: false,
        message: "Too many requests. Try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
})

const makeLimiter = (limit) => rateLimit({
    windowMs: 10 * 60 * 1000,
    limit,
    keyGenerator: (req) => req.userId.id,
    message: { success: false, message: "Too many requests. Try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

const interviewLimiter = makeLimiter(5);    // generateInterviewQuestion
const feedbackLimiter = makeLimiter(30);   // getAIsFeedBack
const insightLimiter = makeLimiter(10);   // industrialData
const resumeAiLimiter = makeLimiter(20);



// module.exports = { aiResumeLimiter , RateLimitor };
module.exports = {
    RateLimitor, aiResumeLimiter,
    aiRateLimitor,
    otpLimitor,
    interviewLimiter,
    feedbackLimiter,
    insightLimiter,
    resumeAiLimiter
};
// module.exports = RateLimitor;