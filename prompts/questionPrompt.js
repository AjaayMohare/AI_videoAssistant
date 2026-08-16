function questionPrompt(text) {
    return [
        {
            role: "system",
            content:
                "Extract all unresolved questions or topics requiring follow-up " +
                "from the transcript. Return them as a numbered list. " +
                "Do not invent questions. " +
                "If none exist, say 'No open questions found.'"
        },
        {
            role: "user",
            content: text
        }
    ];
}

module.exports = questionPrompt;