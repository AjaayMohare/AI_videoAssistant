const loadLLM = require("../summarization/loadLLM");
const decisionPrompt = require("../prompts/decisionPrompt");

async function extractDecisions(transcript) {
    const generator = await loadLLM();

    const messages = decisionPrompt(transcript);

    const result = await generator(messages, {
        max_new_tokens: 400,
        do_sample: false
    });

    return result[0].generated_text.at(-1).content;
}

module.exports = extractDecisions;