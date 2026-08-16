function actionPrompt(text) {
    return [
        {
            role: "system",
            content:
                "You are an expert meeting analyst. " +
                "Extract all action items from the transcript.\n\n" +
                "For each action item provide:\n" +
                "- Task\n" +
                "- Owner\n" +
                "- Deadline\n\n" +
                "If the owner or deadline is not mentioned, write 'Not specified'. " +
                "If there are no action items, say 'No action items found.'"
        },
        {
            role: "user",
            content: text
        }
    ];
}

module.exports = actionPrompt;
