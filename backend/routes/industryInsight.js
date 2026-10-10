const express = require("express");
const router = express.Router();

const { industrialInsight } = require("../controllers/AIindustrialData");
const {insightLimiter} = require("../middlewares/RateLimitor");

const {
    auth, isUser, isAdmin
} = require("../middlewares/Auth");


router.post("/industrialData",auth, isUser,insightLimiter, industrialInsight);


module.exports = router;