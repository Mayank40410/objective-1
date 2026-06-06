import express from "express";
import Document from "../models/Document.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    const documents = await Document.find();

    let matchedChunks = [];

    documents.forEach((doc) => {
      doc.chunks.forEach((chunk) => {
        const words = message.toLowerCase().split(" ");

        const isMatch = words.some((word) =>
          chunk.toLowerCase().includes(word)
        );

        if (isMatch) {
          matchedChunks.push(chunk);
        }
      });
    });

    if (matchedChunks.length === 0) {
      return res.json({
        aiResponse: "No related information found in uploaded PDFs."
      });
    }

    res.json({
      aiResponse: matchedChunks.slice(0, 2).join(" ")
    });

  } catch (error) {
    res.status(500).json({
      message: "Chat failed",
      error: error.message
    });
  }
});

export default router;