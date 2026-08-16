function cosineSimilarity(a, b) {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator ? dot / denominator : 0;
}

async function retrieveContext(question, vectorStore, createEmbedding, k = 4) {
    const questionEmbedding = await createEmbedding(question);

    const results = vectorStore.map(item => ({
        text: item.text,
        score: cosineSimilarity(questionEmbedding, item.embedding)
    }));

    results.sort((a, b) => b.score - a.score);

    return results.slice(0, k);
}

module.exports = retrieveContext;
