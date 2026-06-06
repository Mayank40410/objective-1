import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        aiResponse: "Please enter a question."
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant inside a research workspace dashboard. Answer clearly and simply."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500
    });

    res.json({
      aiResponse: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("AI Chat Error:", error.message);

    res.status(500).json({
      aiResponse:
        "AI service failed. Please check OPENAI_API_KEY in .env and Render Environment."
    });
  }
});

export default router;