import Chunk from "../models/Chunk.js";
import { generateEmbedding } from "./embeddingEngine.js";

function cosineSimilarity(a, b) {
  if (!a.length || !b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function retrieveRelevantChunks(question) {
  const questionEmbedding = await generateEmbedding(question);

  const chunks = await Chunk.find({
    embedding: { $exists: true, $ne: [] }
  });

  const scoredChunks = chunks.map((chunk) => {
    const score = cosineSimilarity(questionEmbedding, chunk.embedding);

    return {
      chunk,
      score
    };
  });

  scoredChunks.sort((a, b) => b.score - a.score);

  return scoredChunks
    .filter((item) => item.score >= 0.3)
    .slice(0, 5);
}