const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateGemini = async (prompt, config = {}) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: config
    })
    const text = response.text;
    if (!text) {
        throw new Error("Gemini returned an empty response");
    }
    return text;
}


module.exports = generateGemini;