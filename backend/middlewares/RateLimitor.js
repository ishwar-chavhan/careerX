import { rateLimit } from 'express-rate-limit';

export const RateLimitor = rateLimit({
    windowMs : 10 * 60 * 1000,
    max : 100,
    message : {
        success : false,
        message : "too many request please try again later"
    }, 
    standardHeaders : true,
    legacyHeaders : false,
})



 export const aiResumeLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes
    limit: 5,                 // 5 requests per window
    message: {
        success: false,
        message: "Too many requests. Try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

export const aiRateLimitor = rateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes
    limit: 3,                 // 5 requests per window
    message: {
        success: false,
        message: "Too many requests. Try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
})

// module.exports = { aiResumeLimiter , RateLimitor };

// module.exports = RateLimitor;