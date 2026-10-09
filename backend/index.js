require("dotenv").config();            

const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const { connect } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const { RateLimitor } = require("./middlewares/RateLimitor");

const profileRoutes = require("./routes/profile");
const interviewRoutes = require("./routes/interviewRoutes");
const industrialRoutes = require("./routes/industryInsight");
const resumeRoutes = require("./routes/Resume");

const app = express();
const PORT = process.env.PORT || 4000;

app.set("trust proxy", 1);            

connect();
cloudinaryConnect();


app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim());

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(RateLimitor);                 

app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp"
}));

// ---------- routes ----------
app.use("/api/v1/auth", profileRoutes);
app.use("/api/v1/interview", interviewRoutes);
app.use("/api/v1/industry", industrialRoutes);
app.use("/api/v1/resume", resumeRoutes);

app.listen(PORT, () => {
    console.log("the server is started at port", PORT);
});