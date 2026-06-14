export function cleanText(rawText = "") {
  let text = String(rawText);

  // Unicode normalization
  text = text.normalize("NFKD");

  // Remove URLs
  text = text.replace(/https?:\/\/\S+/g, "");

  // Remove email addresses
  text = text.replace(/\S+@\S+\.\S+/g, "");

  // Remove page numbers like Page 1, Page 2
  text = text.replace(/Page\s+\d+/gi, "");

  // Remove separator lines
  text = text.replace(/[-_]{3,}/g, "");

  // Remove unwanted special characters but keep useful punctuation
  text = text.replace(/[^a-zA-Z0-9\s.,!?;:()\-'"\/]/g, "");

  // Fix broken lines
  text = text.replace(/\n+/g, " ");

  // Remove extra spaces
  text = text.replace(/\s+/g, " ");

  return text.trim();
}