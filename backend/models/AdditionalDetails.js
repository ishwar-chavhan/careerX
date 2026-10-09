const mongoose = require("mongoose");

const additionalDetailsSchema = new mongoose.Schema({
    contactNumber: {
        type: Number,
        required: true,
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("AdditionalDetails", additionalDetailsSchema);