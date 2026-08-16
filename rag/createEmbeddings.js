const { pipeline } = require("@huggingface/transformers");

let embedder;

async function loadEmbedder() {
    if (!embedder) {
        console.log("Loading embedding model...");

        embedder = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        );

        console.log("Embedding model loaded!");
    }

    return embedder;
}

async function createEmbedding(text) {
    const model = await loadEmbedder();

    const output = await model(text, {
        pooling: "mean",
        normalize: true
    });

    return Array.from(output.data);
}

module.exports = createEmbedding;
