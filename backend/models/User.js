const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
    },
    image: {
        type: String,
        required: true
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdditionalDetails",
        // required: true,
    },
    accountType: {
        type: String,
        enum: ["User", "Admin"],
        default: "User",
    },
    feedback: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AIsAnswer",
        }
    ],
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    interviewCount: {
        type: Number,
        // required : true,
    },
    resumeId : [
           {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
        }
    ]
})

module.exports = mongoose.model("User", userSchema);