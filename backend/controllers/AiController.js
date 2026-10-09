// const { GoogleGenAI } = require("@google/genai");
const PromptAndQuestion = require("../models/PromptAndQuestion");
const AIsAnswer = require("../models/AIsFeedback");
const User = require("../models/User");
// const ai = new GoogleGenAI({
//     apiKey : process.env.GEMINI_API_KEY
// })

const generateGemini = require("../services/geminiAI");
const generateGroq = require("../services/groqAI");
const generateOpenRouter = require("../services/operrouterAI");




const MAX_INTERVIEWS = 7;

// Keeps only the latest 7 interviews of a user.
// Older interviews, their answers and their ids inside user.feedback are deleted.
async function keepLatestInterviews(userId) {
    const old = await PromptAndQuestion.find({ userId })
        .sort({ interviewCount: -1 })
        .skip(MAX_INTERVIEWS); // everything after the latest 7

    if (!old.length) return;

    const counts = old.map((i) => i.interviewCount);
    const oldAnswers = await AIsAnswer.find({ userId, interviewCount: { $in: counts } }).select("_id");
    const answerIds = oldAnswers.map((a) => a._id);

    await AIsAnswer.deleteMany({ _id: { $in: answerIds } });
    await PromptAndQuestion.deleteMany({ _id: { $in: old.map((i) => i._id) } });
    await User.findByIdAndUpdate(userId, { $pull: { feedback: { $in: answerIds } } });
}

exports.generateInterviewQuestion = async (req, res) => {
    try {
        const { field, count } = req.body;
        const userId = req.userId.id;

        if (!field || !count) {
            return res.status(400).json({
                success: false,
                message: "all field are required"
            })
        }

        const prompt = `
        Generate exactly 9 technical interview questions for a ${field} role,
        for a fresher candidate.

        Return only a JSON array of strings.
        Do not return markdown.
        Do not return any extra text.
        `;

        const config = {
            responseMimeType: "application/json",
            responseSchema: {
                type: "array",
                items: {
                    type: "string"
                }
            }
        }
        let response;
        try {
            console.log("trying gemine---->");
            response = await generateGemini(prompt, config);
            console.log("Gemini success");

        } catch (error) {
            console.log("gemini failed----->", error);
            try {
                console.log("Trying OpenRouter...");
                response = await generateOpenRouter(prompt);
                console.log("OpenRouter success");
            } catch (error) {
                console.log("openrouter failed---->", error);
                try {
                    console.log("Trying Groq...");
                    response = await generateGroq(prompt);
                    console.log("Groq success");
                } catch (error) {
                    console.log("all AI are failed");
                    return res.status(500).json({
                        success: false,
                        message: "all AI are failed, please try again later"
                    })
                }
            }
        }
        console.log("reponse of geneted interview q controller", response);
        const questions = JSON.parse(response);

        if (!Array.isArray(questions) || questions.length !== 9) {
            return res.status(500).json({
                success: false,
                message: "AI did not generate exactly 9 questions"
            });
        }

        const interview = await PromptAndQuestion.create({
            userId,
            field,
            interviewCount: count,
            questions
        })

        await keepLatestInterviews(userId); // delete anything older than the latest 7

        const userCountUpdate = await User.findByIdAndUpdate(userId, {
            interviewCount: count
        },
            {
                new: true
            }
        )



        return res.status(200).json({
            success: true,
            data: interview,
            message: "you have fetch Question from AI successfully ",
            userCountUpdate
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.getInterviewQuestion = async (req, res) => {
    try {
        const { count } = req.body;
        const userId = req.userId.id;
        if (!count) {
            return res.status(400).json({
                success: false,
                message: "please provide all field"
            })
        }

        const interviewQuestion = await PromptAndQuestion.find({
            userId: userId,
            interviewCount: count
        });

        if (interviewQuestion.length === 0) {
            return res.status(404).json({
                success: false,
                message: "could not find question please try again later"
            })
        }

        return res.status(200).json({
            success: true,
            questions: interviewQuestion,
            message: "all question is fetched"
        })


    } catch (error) {
        console.log("error in getAllQuestion", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.getAIsFeedBack = async (req, res) => {
    try {
        const { count, answer, question } = req.body;
        const userId = req.userId.id;

        if (!count || !answer || !question) {
            return res.status(400).json({
                success: false,
                message: "all field are required"
            })
        }

        const config = {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    feedback: {
                        type: "string"
                    },
                    score: {
                        type: "number"
                    }
                },
                required: [
                    "feedback",
                    "score"
                ]
            }
        }

        const prompt = `
        You are a technical interview evaluator.

        Evaluate the candidate's answer to the interview question.

        Interview Question:
        ${question}

        Candidate's Answer:
        ${answer}

        Evaluate the answer based on:
        1. Technical correctness
        2. Completeness
        3. Understanding of the concept
        4. Accuracy
        5. Relevance to the question

        Give constructive feedback suitable for a fresher candidate.

        Give a score from 0 to 10:
        - 0 = completely incorrect or no relevant answer
        - 1-3 = poor understanding
        - 4-5 = basic understanding with significant gaps
        - 6-7 = acceptable understanding with some gaps
        - 8-9 = strong and mostly complete answer
        - 10 = excellent, accurate and complete answer

        Return ONLY valid JSON in exactly this format:

        {
            "feedback": "Your detailed feedback here",
            "score": 7
        }

        Do not return markdown.
        Do not return any extra text.
        `;

        let response;


        try {
            console.log("trying gemine---->");
            response = await generateGemini(prompt, config);
            console.log("Gemini success");

        } catch (error) {
            console.log("gemini failed----->", error);
            try {
                console.log("Trying OpenRouter...");
                response = await generateOpenRouter(prompt);
                console.log("OpenRouter success");
            } catch (error) {
                console.log("openrouter failed---->", error);
                try {
                    console.log("Trying Groq...");
                    response = await generateGroq(prompt);
                    console.log("Groq success");
                } catch (error) {
                    console.log("all AI are failed");
                    return res.status(500).json({
                        success: false,
                        message: "all AI are failed, please try again later"
                    })
                }
            }
        }

        const info = JSON.parse(response);

        const feedback = await AIsAnswer.create({
            userId,
            interviewCount: count,
            question,
            answer,
            feedback: info.feedback,
            score: info.score
        })


        if (!feedback) {
            return res.status(401).json({
                success: false,
                message: "could not created feed"
            })
        }

        const userDetails = await User.findByIdAndUpdate(userId,
            {
                $push: {
                    feedback: feedback._id
                }
            }, {
            new: true
        }
        ).populate("feedback").exec();


        return res.status(200).json({
            success: true,
            message: "feedback is create successfully",
            feedback,
            userDetails
        })


    } catch (error) {
        console.log("error in getAllQuestion", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getFeedbackByCount = async (req, res) => {
    try {
        const { count } = req.body;
        const userId = req.userId.id;
        if (!count) {
            return res.status(400).json({
                success: false,
                message: "all field must required"
            })
        }
        const feedbackData = await AIsAnswer.find({
            userId, interviewCount: count
        });
        if (!feedbackData) {
            return res.status(404).json({
                success: false,
                message: "feedback not found"
            })
        };
        return res.status(200).json({
            success: true,
            message: "successfully fetched feedback data",
            feedbackData,
        })
    } catch (error) {
        console.log("error in get feedback by count", error);
        return res.status(500).json({
            success: false,
            message: "could not get feedback by count"
        }
        )

    }
}

exports.getUserFeedbackData = async (req, res) => {
    try {
        const userId = req.userId.id;
        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "userId not found"
            })
        }

        const userDetails = await User.findById(userId).populate("feedback").exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        return res.status(200).json({
            success: true,
            userDetails,
            message: "user details fetched successfully"
        })

    } catch (error) {
        console.log("error in get User feedback data", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// List of the user's interviews (newest first, max 7) with their total score
exports.getInterviewHistory = async (req, res) => {
    try {
        const userId = req.userId.id;

        const interviews = await PromptAndQuestion.find({ userId })
            .sort({ interviewCount: -1 })
            .limit(MAX_INTERVIEWS);

        const answers = await AIsAnswer.find({
            userId,
            interviewCount: { $in: interviews.map((i) => i.interviewCount) }
        });

        const history = interviews.map((i) => {
            const mine = answers.filter((a) => a.interviewCount === i.interviewCount);
            return {
                count: i.interviewCount,
                field: i.field,
                date: i._id.getTimestamp(), // creation time from the ObjectId (no schema change needed)
                totalQuestions: i.questions.length,
                answered: mine.length,
                totalScore: mine.reduce((sum, a) => sum + a.score, 0)
            };
        });

        return res.status(200).json({
            success: true,
            history
        })

    } catch (error) {
        console.log("error in getInterviewHistory", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// Full result of one interview: every question with answer, feedback and score
exports.getInterviewResult = async (req, res) => {
    try {
        const { count } = req.body;
        const userId = req.userId.id;

        if (!count) {
            return res.status(400).json({
                success: false,
                message: "count is required"
            })
        }

        const interview = await PromptAndQuestion.findOne({ userId, interviewCount: count }).sort({ _id: -1 });
        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "interview not found"
            })
        }

        const answers = await AIsAnswer.find({ userId, interviewCount: count });

        const results = interview.questions.map((question) => {
            const a = answers.find((x) => x.question === question);
            return a
                ? { question, answer: a.answer, feedback: a.feedback, score: a.score }
                : { question, skipped: true };
        });

        return res.status(200).json({
            success: true,
            result: {
                count,
                field: interview.field,
                date: interview._id.getTimestamp(),
                results
            }
        })

    } catch (error) {
        console.log("error in getInterviewResult", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}