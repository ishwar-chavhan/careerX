const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 80,
        default: "Untitled resume"
    },
    contact: {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        linkedin: {
            type: String,
            trim: true
        },
        github: {
            type: String,
            trim: true
        },
        leetcode: {
            type: String,
            trim: true
        },
        portfolio: {
            type: String,
            trim: true
        }
    },
    skills: [
        {
            category: {
                type: String,
                trim: true
            },
            items: {
                type: String,
                trim: true
            }
        }
    ],
    experience: [
        {
            company: {
                type: String,
                trim: true
            },
            location: {
                type: String,
                trim: true
            },
            role: {
                type: String,
                trim: true
            },
            // "YYYY-MM" strings coming from <input type="month">
            startDate: {
                type: String,
                trim: true
            },
            endDate: {
                type: String,
                trim: true
            },
            current: {
                type: Boolean,
                default: false
            },
            // bullet points, one string per line. **bold** markers are kept as typed
            points: [
                {
                    type: String,
                    trim: true
                }
            ]
        }
    ],
    projects: [
        {
            name: {
                type: String,
                trim: true
            },
            points: [
                {
                    type: String,
                    trim: true
                }
            ]
        }
    ],
    education: [
        {
            institution: {
                type: String,
                trim: true
            },
            location: {
                type: String,
                trim: true
            },
            // put the score here, e.g. "B.Tech in Electrical Engineering – CGPA: 7.9"
            degree: {
                type: String,
                trim: true
            },
            startYear: {
                type: String,
                trim: true
            },
            endYear: {
                type: String,
                trim: true
            }
        }
    ]
}, { timestamps: true });   // updatedAt is shown as "Last edited" on the list page

module.exports = mongoose.model("Resume", resumeSchema);