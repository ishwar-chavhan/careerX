
require("dotenv").config();

const generateOpenRouter = async (prompt) => {
    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openrouter/free",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        }
    );

    if (!response.ok) {
        throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();

    return data.choices[0].message.content;
}

module.exports = generateOpenRouter;