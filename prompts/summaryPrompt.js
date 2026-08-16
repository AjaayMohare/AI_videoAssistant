function summaryPrompt(text) {
    return [
        {
            role: "system",
            content:
                "You are an expert meeting and lecture summarizer. " +
                "Summarize the provided transcript clearly. " +
                "Preserve important concepts, facts, examples and conclusions. " +
                "Do not add information that is not present in the transcript."
        },
        {
            role: "user",
            content: text
        }
    ];
}

module.exports = summaryPrompt;