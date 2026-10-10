const express = require("express");

const router = express.Router();
const {resumeAiLimiter} = require("../middlewares/RateLimitor");
const {
    createResume,
    getMyResumes,
    getResumeById,
    updateResume,
    deleteResume,
} = require("../controllers/ResumeController");

const {
     AIImprovedResumeDescription
} = require("../controllers/AIResume");

const { auth } = require("../middlewares/Auth");

router.post("/create", auth,resumeAiLimiter, createResume);
router.post("/ai-improve-description", auth,resumeAiLimiter, AIImprovedResumeDescription);
// "/my-resumes" must stay ABOVE "/:resumeId", otherwise express treats "my-resumes" as an id
router.get("/my-resumes", auth, getMyResumes);
router.get("/:resumeId", auth, getResumeById);
router.put("/update/:resumeId", auth, updateResume);
router.delete("/delete/:resumeId", auth, deleteResume);


module.exports = router;