const loadLLM = require("../summarization/loadLLM");
const questionPrompt = require("../prompts/questionPrompt");

async function extractQuestions(transcript) {
    const generator = await loadLLM();

    const messages = questionPrompt(transcript);

    const result = await generator(messages, {
        max_new_tokens: 400,
        do_sample: false
    });

    return result[0].generated_text.at(-1).content;
}

module.exports = extractQuestions;