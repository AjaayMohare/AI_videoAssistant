const { pipeline } = require("@huggingface/transformers");

let generator;

async function loadLLM() {
    if (generator) {
        return generator;
    }

    console.log("Loading Hugging Face LLM...");

    generator = await pipeline(
        "text-generation",
        "onnx-community/Qwen2.5-1.5B-Instruct",
        {
            dtype: "q4"
        }
    );

    console.log("LLM loaded!");

    return generator;
}

module.exports = loadLLM;