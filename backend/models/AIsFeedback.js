const mongoose = require("mongoose");

const AIsAnswerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    interviewCount: {
        type: Number,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        require: true,
    },
    score: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("AIsAnswer", AIsAnswerSchema);