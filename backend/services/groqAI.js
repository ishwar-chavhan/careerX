const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateGroq = async (prompt) => {
    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    });

    return response.choices[0].message.content;
}

module.exports = generateGroq;