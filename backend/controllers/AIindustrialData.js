const industrialInsight = require("../models/IndustrialInsight");
const generateGemini = require("../services/geminiAI");
const generateOpenRouter = require("../services/operrouterAI");
const generateGroq = require("../services/groqAI");


exports.industrialInsight = async (req, res) => {
    try {

        console.log()
        const { industry } = req.body;
        const userId = req.userId.id;

        if (!industry || !userId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const findIndustryData = await industrialInsight.findOne({
            industry: industry
        })

        if (findIndustryData && findIndustryData.expiresAt > new Date()) {
            return res.status(200).json({
                message: "already fresh data present",
                success: true,
                data: findIndustryData,
                // message: "Successfully fetched industrial insight"
            });
        }


        const prompt = `
                    You are an industry research analyst.

                    Generate an industry insight report for:

                    Industry: ${industry}

                    Rules:
                    - Return only valid JSON.
                    - Return exactly 5 jobMarket items.
                    - Return exactly 5 trendingTechnologies items.
                    - Return exactly 5 roleBasedRequiredSkills items.
                    - Each role must have 4-6 relevant skills.
                    - outlook must be exactly "Positive" or "Negative".
                    - demandLevel must be "Low", "Medium", or "High".
                    - demand and importance must be numbers from 0-100.
                    - growthPercentage must be a number.
                    - Salary must be annual INR.
                    - minimum salary must be lower than maximum salary.
                    - All data must be relevant to the selected industry.
                    - Do not duplicate roles, technologies, or skills.

                    Return this structure:

                    {
                        "industry": "string",

                        "marketOverview": {
                            "outlook": "Positive",
                            "growthPercentage": 0,
                            "demandLevel": "High"
                        },

                        "jobMarket": [
                            {
                                "role": "string",
                                "demand": 0,
                                "salary": {
                                    "minimum": 0,
                                    "maximum": 0
                                }
                            }
                        ],

                        "trendingTechnologies": [
                            {
                                "technology": "string",
                                "demand": 0
                            }
                        ],

                        "roleBasedRequiredSkills": [
                            {
                                "role": "string",
                                "skills": [
                                    {
                                        "name": "string",
                                        "importance": 0
                                    }
                                ]
                            }
                        ]
                    }

                    Example:
                    For "Cybersecurity", generate 5 cybersecurity-related jobs,
                    5 trending cybersecurity technologies, and 5 cybersecurity roles
                    with 4-6 relevant skills for each role.
                    `;

        const config = {
            responseMimeType: "application/json",

            responseSchema: {
                type: "object",

                properties: {

                    industry: {
                        type: "string"
                    },

                    marketOverview: {
                        type: "object",
                        properties: {

                            outlook: {
                                type: "string",
                                enum: ["Positive", "Negative"]
                            },

                            growthPercentage: {
                                type: "number"
                            },

                            demandLevel: {
                                type: "string",
                                enum: ["Low", "Medium", "High"]
                            }

                        },
                        required: [
                            "outlook",
                            "growthPercentage",
                            "demandLevel"
                        ]
                    },

                    jobMarket: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {

                                role: {
                                    type: "string"
                                },

                                demand: {
                                    type: "number"
                                },

                                salary: {
                                    type: "object",
                                    properties: {

                                        minimum: {
                                            type: "number"
                                        },

                                        maximum: {
                                            type: "number"
                                        }

                                    },
                                    required: [
                                        "minimum",
                                        "maximum"
                                    ]
                                }

                            },
                            required: [
                                "role",
                                "demand",
                                "salary"
                            ]
                        }
                    },

                    trendingTechnologies: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {

                                technology: {
                                    type: "string"
                                },

                                demand: {
                                    type: "number"
                                }

                            },
                            required: [
                                "technology",
                                "demand"
                            ]
                        }
                    },

                    roleBasedRequiredSkills: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {

                                role: {
                                    type: "string"
                                },

                                skills: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {

                                            name: {
                                                type: "string"
                                            },

                                            importance: {
                                                type: "number"
                                            }

                                        },
                                        required: [
                                            "name",
                                            "importance"
                                        ]
                                    }
                                }

                            },
                            required: [
                                "role",
                                "skills"
                            ]
                        }
                    }

                },

                required: [
                    "industry",
                    "marketOverview",
                    "jobMarket",
                    "trendingTechnologies",
                    "roleBasedRequiredSkills"
                ]
            }
        };

        let response;

        try {
            console.log("trying gemine---->");
            response = await generateGemini(prompt, config);
            console.log("Gemini success");
        } catch (error) {
            console.log("Gemini provider failed");
            try {
                console.log("Trying OpenRouter...");
                response = await generateOpenRouter(prompt);
                console.log("OpenRouter success");
            } catch (error) {
                console.log("OpenRouter provider failed");

                try {

                    console.log("Trying Groq...");

                    response = await generateGroq(prompt);

                    console.log("Groq success");

                } catch (error) {

                    console.log("Groq provider failed");

                    throw new Error("All AI providers failed");
                }
            }
        }

        let industryData;
        if (typeof response === "string") {
            const cleanResponse = response
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            industryData = JSON.parse(cleanResponse);
        } else {
            industryData = response;
        }

        console.log(industryData);
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        let savedData;



        if (findIndustryData) {

            // Existing but expired data
            findIndustryData.marketOverview = industryData.marketOverview;
            findIndustryData.jobMarket = industryData.jobMarket;
            findIndustryData.trendingTechnologies = industryData.trendingTechnologies;
            findIndustryData.roleBasedRequiredSkills = industryData.roleBasedRequiredSkills;
            findIndustryData.expiresAt = expiresAt;
            savedData = await findIndustryData.save();

        } else {

            // No data exists
            savedData = await industrialInsight.create({
                industry: industryData.industry,
                marketOverview: industryData.marketOverview,
                jobMarket: industryData.jobMarket,
                trendingTechnologies: industryData.trendingTechnologies,
                roleBasedRequiredSkills: industryData.roleBasedRequiredSkills,
                expiresAt: expiresAt
            });
        }

        return res.status(200).json({
            success: true,
            data: savedData,
            message: "Successfully fetched industrial insight"
        });

    } catch (error) {
        console.error("Industrial Insight Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate industrial insight"
        });
    }
};