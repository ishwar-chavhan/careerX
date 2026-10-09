const mongoose = require("mongoose");

const IndustryInsightSchema = new mongoose.Schema({
    industry: {
        type: String,
        required: true,
        unique: true
    },
    marketOverview: {
        outlook: {
            type: String,
            required: true,
        },
        growthPercentage: {
            type: Number,
            required: true,
        },
        demandLevel: {
            type: String,
            required: true,
        }
    },
    jobMarket: [
        {
            role: {
                type: String,
                required: true
            },
            demand: {
                type: Number,
                required: true
            },
            salary: {
                minimum: {
                    type: Number,
                    required: true
                },
                maximum: {
                    type: Number,
                    required: true
                }
            }
        }
    ],
    trendingTechnologies: [
        {
            technology: {
                type: String,
                required: true
            },
            demand: {
                type: Number,
                required: true
            }
        }
    ],
    roleBasedRequiredSkills: [
        {
            role: {
                type: String,
                required: true
            },
            skills: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    importance: {
                        type: Number,
                        required: true
                    }
                }
            ]
        }
    ],
    expiresAt: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("industrialInsight", IndustryInsightSchema);