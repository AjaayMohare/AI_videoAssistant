function chunkText(text, maxCharacters = 6000, overlapCharacters = 400) {
    if (typeof text !== "string" || !text.trim()) {
        return [];
    }

    if (maxCharacters <= overlapCharacters) {
        throw new Error("maxCharacters must be greater than overlapCharacters.");
    }

    const normalized = text.replace(/\s+/g, " ").trim();
    const chunks = [];
    let start = 0;

    while (start < normalized.length) {
        let end = Math.min(start + maxCharacters, normalized.length);

        if (end < normalized.length) {
            const boundary = Math.max(
                normalized.lastIndexOf(". ", end),
                normalized.lastIndexOf("? ", end),
                normalized.lastIndexOf("! ", end),
                normalized.lastIndexOf(" ", end)
            );

            if (boundary > start + Math.floor(maxCharacters * 0.5)) {
                end = boundary + 1;
            }
        }

        chunks.push(normalized.slice(start, end).trim());
        if (end === normalized.length) break;
        start = end - overlapCharacters;
    }

    return chunks;
}

module.exports = chunkText;
