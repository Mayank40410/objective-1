export function createChunks(text, documentId, documentName) {
  const words = text.split(/\s+/);
  const chunkSize = 500;
  const overlap = 50;

  const chunks = [];
  let chunkIndex = 0;

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunkWords = words.slice(i, i + chunkSize);
    const chunkText = chunkWords.join(" ").trim();

    if (chunkText.length > 50) {
      chunks.push({
        documentId,
        documentName,
        chunkIndex,
        page: Math.floor(i / chunkSize) + 1,
        chunkText
      });

      chunkIndex++;
    }
  }

  return chunks;
}