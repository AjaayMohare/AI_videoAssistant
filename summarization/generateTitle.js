const loadLLM = require("./loadLLM");
const titlePrompt = require("../prompts/titlePrompt");

async function generateTitle(transcript) {
    const generator = await loadLLM();

    const messages = titlePrompt(transcript.slice(0, 3000));

    const result = await generator(messages, {
        max_new_tokens: 30,
        do_sample: false
    });

    return result[0].generated_text.at(-1).content.trim();
}

module.exports = generateTitle;
