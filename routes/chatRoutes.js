import express from "express";
import Document from "../models/Document.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        aiResponse: "Please enter a question."
      });
    }

    const documents = await Document.find();

    let context = "";

    documents.forEach((doc) => {
      doc.chunks.forEach((chunk) => {
        const questionWords = message.toLowerCase().split(" ");

        const matched = questionWords.some((word) =>
          chunk.toLowerCase().includes(word)
        );

        if (matched && context.length < 3000) {
          context += chunk + "\n";
        }
      });
    });

    const prompt = `
You are a helpful AI assistant.

Use the document context if it is relevant.
If the context is not relevant, answer normally.

Document Context:
${context || "No relevant document context found."}

User Question:
${message}
`;

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3.2:3b",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        stream: false
      })
    });

    const data = await response.json();

    res.json({
      aiResponse:
        data.message?.content || "No response received from local LLM."
    });

  } catch (error) {
    console.error("Local LLM Error:", error.message);

    res.status(500).json({
      aiResponse:
        "Local AI is not running. Start Ollama first using: ollama run llama3.2:3b"
    });
  }
});

export default router;