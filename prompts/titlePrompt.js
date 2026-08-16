function titlePrompt(text) {
    return [
        {
            role: "system",
            content:
                "Generate a short professional title for this video. " +
                "Maximum 8 words. Return only the title."
        },
        {
            role: "user",
            content: text
        }
    ];
}

module.exports = titlePrompt;