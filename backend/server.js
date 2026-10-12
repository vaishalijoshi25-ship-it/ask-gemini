const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || question.trim() === "") {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }
    let response;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: question,
        });
        break;
      } catch (error) {
        console.log(`Gemini attempt ${attempt} failed.`);
        if (error.status !== 503 || attempt === 3) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    res.json({
      answer: response.text,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Something went wrong while getting the AI response.",
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});






































