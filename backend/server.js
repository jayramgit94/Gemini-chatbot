const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// Load API key from .env
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ API key is missing. Check your .env file.");
    process.exit(1);
}

// Initialize Gemini AI model
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message.trim();
        if (!userMessage) {
            return res.status(400).json({ reply: "No message provided!" });
        }

        // Send the user message to Gemini AI
        const result = await model.generateContent(userMessage);
        const response = await result.response;

        if (!response || !response.text) {
            throw new Error("Invalid AI response");
        }

        res.json({ reply: response.text() });
    } catch (error) {
        console.error("❌ AI Error:", error.message || error);
        res.status(500).json({ reply: "AI is currently unavailable. Try again later!" });
    }
});

app.listen(3000, () => {
    console.log("✅ Server is running on http://localhost:3000");
});
