const { pipeline } = require("@huggingface/transformers");

let transcriber;

async function loadWhisper() {
    if (transcriber) {
        return transcriber;
    }

    console.log("Loading Whisper model...");

    transcriber = await pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-base"
    );

    console.log("Whisper loaded!");

    return transcriber;
}

module.exports = loadWhisper;
