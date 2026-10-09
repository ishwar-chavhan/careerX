// const express = require("express");
const express = require("express");
const cookieParser = require('cookie-parser')
const router = express.Router();
const app = express();
const helmet = require("helmet");
const {RateLimitor} = require("./middlewares/RateLimitor")
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");
require("dotenv").config();
const { connect } = require("./config/database");
const PORT = process.env.PORT || 4000;
app.use(RateLimitor);
connect();
cloudinaryConnect();

const profileRoutes = require("./routes/profile");
const interviewRoutes = require("./routes/interviewRoutes");
const industrialRoutes = require("./routes/industryInsight");
const resumeRoutes = require("./routes/Resume"); 

const cors = require("cors");
const allowedOrigins = process.env.CORS_ORIGINS || "http://localhost:5173";
app.use(cors({
    origin: allowedOrigins,
     credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp" 
    })
)
app.use(RateLimitor);



app.use("/api/v1/auth", profileRoutes);
// app.use("/api/v1/profile" , profileRoutes);
app.use("/api/v1/interview", interviewRoutes);
app.use("/api/v1/industry", industrialRoutes);
app.use("/api/v1/resume", resumeRoutes);




app.listen(PORT, () => {
    console.log(`the surver is started at post`, PORT);
})