const express = require("express");
const router = express.Router();

const { industrialInsight } = require("../controllers/AIindustrialData");
const {aiRateLimitor} = require("../middlewares/RateLimitor");

const {
    auth, isUser, isAdmin
} = require("../middlewares/Auth");


router.post("/industrialData",aiRateLimitor, auth, isUser, industrialInsight);


module.exports = router;