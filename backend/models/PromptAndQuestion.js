const mongoose = require("mongoose");

const promptAndQuestionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    field: {
        type: String,
        required: true,
    },
    interviewCount: {
        type: Number,
        required: true,
    },
    questions: [
        {
            type: String,
            required: true,
        }
    ]
})


module.exports = mongoose.model("PromptAndQuestion", promptAndQuestionSchema);