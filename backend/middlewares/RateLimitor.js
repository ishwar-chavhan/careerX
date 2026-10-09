const { rateLimit } = require("express-rate-limit");
 const RateLimitor = rateLimit({
    windowMs : 10 * 60 * 1000,
    max : 100,
    message : {
        success : false,
        message : "too many request please try again later"
    }, 
    standardHeaders : true,
    legacyHeaders : false,
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
    limit:  10,                 
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


// module.exports = { aiResumeLimiter , RateLimitor };
module.exports = { RateLimitor, aiResumeLimiter, aiRateLimitor , otpLimitor };
// module.exports = RateLimitor;