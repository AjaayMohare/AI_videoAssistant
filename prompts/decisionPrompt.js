function decisionPrompt(text) {
    return [
        {
            role: "system",
            content:
                "You are an expert meeting analyst. " +
                "Extract all important decisions made in the transcript. " +
                "Return them as a numbered list. " +
                "Do not invent decisions. " +
                "If there are none, say 'No key decisions found.'"
        },
        {
            role: "user",
            content: text
        }
    ];
}

module.exports = decisionPrompt;