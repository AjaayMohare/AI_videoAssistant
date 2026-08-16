const createEmbedding = require("./createEmbeddings");
const chunkText = require("../utils/chunkText");

async function buildVectorStore(transcript) {
    const chunks = chunkText(transcript);

    const vectorStore = [];

    for (const chunk of chunks) {
        const embedding = await createEmbedding(chunk);

        vectorStore.push({
            text: chunk,
            embedding
        });
    }

    return vectorStore;
}

module.exports = buildVectorStore;
