import express from "express";
import { retrieveRelevantChunks } from "../utils/retriever.js";
import { buildGroundedPrompt } from "../utils/promptBuilder.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        aiResponse: "Please enter a question."
      });
    }

    const retrievedChunks = await retrieveRelevantChunks(message);

    const prompt = buildGroundedPrompt(message, retrievedChunks);

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

    const sources = retrievedChunks.map((item) => ({
      document: item.chunk.documentName,
      page: item.chunk.page,
      chunk: item.chunk.chunkIndex,
      score: item.score.toFixed(3)
    }));

    res.json({
      aiResponse: data.message?.content || "No response from local LLM.",
      sources
    });

  } catch (error) {
    console.error("RAG Chat Error:", error.message);

    res.status(500).json({
      aiResponse:
        "Local RAG AI failed. Make sure Ollama and backend are running."
    });
  }
});

export default router;