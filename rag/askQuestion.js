const loadLLM = require("../summarization/loadLLM");
const createEmbedding = require("./createEmbeddings");
const retrieveContext = require("./retrieveContext");
const ragPrompt = require("../prompts/ragPrompt");

async function askQuestion(question, vectorStore) {
    const generator = await loadLLM();

    const results = await retrieveContext(
        question,
        vectorStore,
        createEmbedding,
        4
    );

    const context = results
        .map(item => item.text)
        .join("\n\n");

    const messages = ragPrompt(context, question);

    const result = await generator(messages, {
        max_new_tokens: 300,
        do_sample: false
    });

    return result[0].generated_text.at(-1).content;
}

module.exports = askQuestion;
