const generateGemini = require("../services/geminiAI");
const generateOpenRouter = require("../services/operrouterAI");
const generateGroq = require("../services/groqAI");

// turns the AI text into a clean array of bullet points
const cleanPoints = (text) => {
    return text
        .split("\n")
        .map((line) =>
            line
                .trim()
                .replace(/^(?:[-•–]\s+|\*\s+|\d+[.)]\s+)/, "")   // remove "- ", "• ", "* ", "1. " (keeps **bold** safe)
                .replace(/^["“]|["”]$/g, "")                      // remove quotes around a line
                .trim()
        )
        .filter(Boolean)
        .slice(0, 5);
}

exports.AIImprovedResumeDescription = async(req , res)=>{
    try{
        const {
            type,
            title,
            organization,
            startDate,
            endDate,
            points
        } = req.body;

        // the editor sends the bullet points as one text (one point per line)
        const pointsText = Array.isArray(points) ? points.join("\n") : String(points || "");

        if (!type || !pointsText.trim()) {
            return res.status(400).json({
                success: false,
                message: "type and points are required"
            });
        }

        if (type !== "project" && type !== "workExperience") {
            return res.status(400).json({
                success: false,
                message: "Invalid type"
            });
        }

        if (pointsText.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Points are too long, keep them under 2000 characters"
            });
        }

        // only send the details the user actually filled in
        const context = [
            title ? `${type === "project" ? "Project name" : "Role"}: ${title}` : "",
            organization ? `Company: ${organization}` : "",
            (startDate || endDate) ? `Dates: ${startDate || "?"} to ${endDate || "?"}` : ""
        ].filter(Boolean).join("\n");

        const prompt = `
                You are an expert professional resume writer.

                Improve the bullet points of the following ${type === "project" ? "project" : "work experience"} entry
                for a professional resume.

                ${context}

                Current bullet points (one per line):
                ${pointsText}

                Rules:
                - Improve the existing points professionally.
                - Use ONLY information explicitly provided in the input.
                - Preserve the original meaning.
                - Keep all information truthful.
                - Do not invent or assume any technologies.
                - Do not invent achievements, responsibilities, numbers, awards,
                metrics, security features, performance improvements, or outcomes.
                - Do not infer technical implementation details.
                - Do not add features that are not explicitly mentioned.
                - Improve only grammar, clarity, structure, and professional wording.
                - Keep the same number of points unless two points say the same thing.
                - Never return more than 5 points.
                - Start each point with a strong action verb.
                - Keep each point on one line and under 25 words.
                - Wrap the most important technologies and results in **double asterisks**,
                at most 3 per point, and only words that already appear in the input.
                - Return ONLY the improved points, one per line.
                - Do not use bullet symbols, numbers, headings or quotation marks.
                - Do not return JSON.
                `;
        const config = {
            temperature: 0.4,
            maxOutputTokens: 600
        };
        let response;

        try {
            console.log("trying gemine---->");
            response = await generateGemini(prompt, config);
            console.log("Gemini success");
        } catch (error) {
            console.log("Gemini failed:", error.message);
            try {
                console.log("Trying OpenRouter...");
                response = await generateOpenRouter(prompt);
                console.log("OpenRouter success");
            } catch (error) {
                console.log("OpenRouter failed:", error.message);
                try {
                    console.log("Trying Groq...");
                    response = await generateGroq(prompt);
                    console.log("Groq success");
                } catch (error) {
                    console.log("Groq failed:", error.message);
                    throw new Error("All AI providers failed");
                }
            }
        }

        const improvedPoints = cleanPoints(response || "");
        if (improvedPoints.length === 0) {
            throw new Error("AI returned an empty response");
        }

        return res.status(200).json({
            success: true,
            message: "Points improved successfully",
            data: { points: improvedPoints }
        });

    }catch(error){
        console.log("error in AI improve resume description" , error);
        return res.status(500).json({
            success : false,
            message : "Unable to improve points at the moment"
        })
    }
}