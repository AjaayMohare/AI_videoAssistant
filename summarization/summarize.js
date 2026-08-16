const loadLLM = require("./loadLLM");
const summaryPrompt = require("../prompts/summaryPrompt");
const chunkText = require("../utils/chunkText");

async function summarize(text) {
    const generator = await loadLLM();

    const chunks = chunkText(text);

    const summaries = [];

    for (const chunk of chunks) {
        const messages = summaryPrompt(chunk);

        const result = await generator(messages, {
            max_new_tokens: 400,
            do_sample: false
        });

        summaries.push(result[0].generated_text.at(-1).content);
    }

    const combined = summaries.join("\n\n");

    const finalPrompt = [
        {
            role: "system",
            content:
                "Combine these partial summaries into one clear and professional summary. " +
                "Remove repetition. Preserve important facts and concepts."
        },
        {
            role: "user",
            content: combined
        }
    ];

    const result = await generator(finalPrompt, {
        max_new_tokens: 600,
        do_sample: false
    });

    return result[0].generated_text.at(-1).content;
}

module.exports = summarize;