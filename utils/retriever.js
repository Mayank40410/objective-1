import Chunk from "../models/Chunk.js";
import { generateEmbedding, cosineSimilarity } from "./embeddingEngine.js";

export async function retrieveRelevantChunks(question, limit = 3) {
  const questionEmbedding = await generateEmbedding(question);

  const chunks = await Chunk.find();

  const rankedChunks = [];

  for (const chunk of chunks) {
    const chunkText = chunk.chunkText || chunk.text || "";

    const chunkEmbedding = await generateEmbedding(chunkText);

    const score = cosineSimilarity(questionEmbedding, chunkEmbedding);

    rankedChunks.push({
      chunkText,
      fileName: chunk.fileName,
      score
    });
  }

  rankedChunks.sort((a, b) => b.score - a.score);

  return rankedChunks.slice(0, limit);
}