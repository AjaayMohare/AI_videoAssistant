function ragPrompt(context, question) {
    return [
        {
            role: "system",
            content:
                "You answer questions only from the supplied video transcript context. " +
                "If the answer is absent, say: 'I could not find this information in the transcript.'"
        },
        {
            role: "user",
            content: `Context:\n${context}\n\nQuestion:\n${question}`
        }
    ];
}

module.exports = ragPrompt;
