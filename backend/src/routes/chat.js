import { Router } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

// Initialize the Google Generative AI outside the handler for efficiency
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Using gemini-1.5-flash for fast and cost-effective responses
const model = genAI?.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are a helpful gift assistant for 'Gifts Plus'. Help users find gifts. Be polite and concise.",
});

router.post("/", async (req, res) => {
  try {
    if (!genAI || !model) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await model.generateContent(message);
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
