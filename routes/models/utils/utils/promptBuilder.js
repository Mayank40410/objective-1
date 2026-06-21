export function buildGroundedPrompt(question, retrievedChunks) {
  const context = retrievedChunks
    .map((item, index) => {
      return `
Source ${index + 1}
Document: ${item.chunk.documentName}
Page: ${item.chunk.page}
Chunk: ${item.chunk.chunkIndex}

${item.chunk.chunkText}
`;
    })
    .join("\n");

  return `
You are a research assistant.

Answer ONLY from the supplied context.
If the answer is not available in the context, reply:
"Information not found in uploaded documents."

Do not use outside knowledge.

Context:
${context || "No relevant context found."}

Question:
${question}

Answer with sources at the end.
`;
}