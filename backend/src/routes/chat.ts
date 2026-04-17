import { Router } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepend instructions to the prompt to stay on the stable v1 API
    const instruction = "Context: You are a helpful gift assistant for 'Gifts Plus'. Help users find gifts for birthdays, anniversaries, and holidays. Be polite and keep answers concise.";
    const prompt = `${instruction}\n\nUser Question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({ 
      error: "Failed to generate AI response",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
