import { Request, Response, Router } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { message, products = [] } = req.body;

    const simplifiedProducts = products.slice(0, 20).map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
    }));

    const prompt = `
You are a friendly and helpful gift assistant for 'Gifts Plus'.

Your goal is to help users find the perfect gift quickly and naturally.

1. **Proactive Suggestions**: As soon as the user mentions ANY specific detail (a price limit, an occasion like 'birthday', or a recipient like 'mom'), immediately provide up to 3 best matches from the products list. Do not keep asking questions if you have enough info to show at least one relevant item.
2. **Conversational Flow**: If the user provides partial info, say something like "Here are a few great options for [Occasion/Price]! If these aren't quite right, let me know more about their interests." 
3. **Handling Vague Requests**: Only ask for more details if the user's message is too broad to make any meaningful suggestion. Even then, suggest 2-3 popular "all-rounder" gifts to get things started.
4. **Greetings**: If they just say "Hi", greet them and ask who they are shopping for, but don't be repetitive if they've already given info.

Products Available:
${JSON.stringify(simplifiedProducts)}

User Message: "${message}"

Response Format (JSON ONLY):
{
  "text": "your conversational reply here",
  "productIds": [] // Only include up to 3 IDs here if making a recommendation, otherwise leave empty.
}
`;

const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  }),
});

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API failed:", errorData);
      throw new Error(errorData.error?.message || "Groq API error");
    }

    const data = await response.json();
    let parsed;

    try {
      // Robust parsing: strip markdown code blocks if the AI included them
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : content;
      
      parsed = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse AI JSON:", data.choices[0].message.content);
      parsed = {
        text: data.choices[0].message.content || "Here are some great options!",
        productIds: [],
      };
    }

    res.json(parsed);
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

export default router;

// import { Router } from 'express';
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const router = Router();

// router.post("/", async (req, res) => {
//   try {
//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
//     }

//     const { message } = req.body;
//     if (!message) {
//       return res.status(400).json({ error: "Message is required" });
//     }

//     const genAI = new GoogleGenerativeAI(apiKey);

//     // 1. Switched to 'gemini-2.0-flash-lite' which appeared in your ListModels log.
//     // 2. Switched to 'v1beta' API version to properly support 2.0 models and systemInstructions.
//     // 3. 'Lite' models often have a different quota bucket than standard 'Flash' models.
//     const model = genAI.getGenerativeModel(
//       {
//         model: "gemini-2.0-flash-lite",
//         systemInstruction: "You are a helpful gift assistant for 'Gifts Plus'. Help users find gifts for birthdays, anniversaries, and holidays. Be polite and keep answers concise.",
//       },
//       { apiVersion: "v1beta" }
//     );

//     const result = await model.generateContent(message);
//     const text = result.response.text();

//     res.json({ reply: text });
//   } catch (error) {
//     console.error("Gemini AI Error:", error);
//     res.status(500).json({
//       error: "Failed to generate AI response",
//       details: error instanceof Error ? error.message : "Unknown error"
//     });
//   }
// });

// export default router;
