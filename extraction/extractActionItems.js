const loadLLM = require("../summarization/loadLLM");
const actionPrompt = require("../prompts/actionPrompt");

async function extractActionItems(transcript) {
    const generator = await loadLLM();

    const messages = actionPrompt(transcript);

    const result = await generator(messages, {
        max_new_tokens: 400,
        do_sample: false
    });

    return result[0].generated_text.at(-1).content;
}

module.exports = extractActionItems;
