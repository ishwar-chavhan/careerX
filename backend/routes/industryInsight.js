const express = require("express");
const router = express.Router();

const { industrialInsight } = require("../controllers/AIindustrialData");


const {
    auth, isUser, isAdmin
} = require("../middlewares/Auth");


router.post("/industrialData", auth, isUser, industrialInsight);


module.exports = router;