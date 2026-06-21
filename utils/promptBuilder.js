export function buildGroundedPrompt(question, relevantChunks = []) {
  const context = relevantChunks
    .map((chunk, index) => {
      return `Chunk ${index + 1}:\n${chunk.chunkText}`;
    })
    .join("\n\n");

  return `
You are a helpful AI research assistant.

Use the document context below to answer the user's question.
If the context does not contain the answer, then answer generally and clearly.

DOCUMENT CONTEXT:
${context}

USER QUESTION:
${question}

FINAL ANSWER:
`;
}