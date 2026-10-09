// const express = require("express");
const express = require("express");
const cookieParser = require('cookie-parser')
const router = express.Router();
const app = express();
app.use(cookieParser());
app.use(express.json());
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");
require("dotenv").config();
const { connect } = require("./config/database");
const PORT = process.env.PORT || 4000;
connect();
cloudinaryConnect();

const profileRoutes = require("./routes/profile");
const interviewRoutes = require("./routes/interviewRoutes");
const industrialRoutes = require("./routes/industryInsight");
const resumeRoutes = require("./routes/Resume");
const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp"
    })
)



app.use("/api/v1/auth", profileRoutes);
// app.use("/api/v1/profile" , profileRoutes);
app.use("/api/v1/interview", interviewRoutes);
app.use("/api/v1/industry", industrialRoutes);
app.use("/api/v1/resume", resumeRoutes);




app.listen(PORT, () => {
    console.log(`the surver is started at post`, PORT);
})