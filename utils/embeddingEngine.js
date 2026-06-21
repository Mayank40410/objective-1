// utils/embeddingEngine.js

export async function generateEmbedding(text) {

    // Simple local embedding generator
    // Later you can replace this with Ollama embedding model

    const vectorSize = 384;

    let vector = new Array(vectorSize).fill(0);

    for (let i = 0; i < text.length; i++) {
        vector[i % vectorSize] += text.charCodeAt(i) / 1000;
    }

    return vector;
}


// compare similarity between two vectors

export function cosineSimilarity(vectorA, vectorB) {

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {

        dotProduct += vectorA[i] * vectorB[i];

        magnitudeA += vectorA[i] * vectorA[i];

        magnitudeB += vectorB[i] * vectorB[i];
    }


    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);


    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }


    return dotProduct / (magnitudeA * magnitudeB);
}