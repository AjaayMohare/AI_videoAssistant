const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const { WaveFile } = require("wavefile");
const loadWhisper = require("./loadWhisper");
const convertAudio = require("../utils/convertAudio");
const chunkAudio = require("../utils/chunkAudio");

async function transcribeAudio(audioFile) {
    const inputPath = path.resolve(audioFile);
    const jobDirectory = path.join(
        path.dirname(inputPath),
        `.transcription-${Date.now()}`
    );
    const normalizedAudio = path.join(jobDirectory, "normalized.wav");
    const chunksDirectory = path.join(jobDirectory, "chunks");

    await fsPromises.mkdir(jobDirectory, { recursive: true });

    try {
        console.log("Preparing audio for transcription...");
        await convertAudio(inputPath, normalizedAudio);
        const audioChunks = await chunkAudio(normalizedAudio, chunksDirectory);
        const transcriber = await loadWhisper();
        const transcriptParts = [];

        for (const [index, chunkFile] of audioChunks.entries()) {
            console.log(`Transcribing audio segment ${index + 1}/${audioChunks.length}...`);
            const audioBuffer = fs.readFileSync(chunkFile);
            const wav = new WaveFile(audioBuffer);
            wav.toSampleRate(16000);
            wav.toBitDepth("32f");

            let audioData = wav.getSamples();
            if (Array.isArray(audioData)) audioData = audioData[0];

            const result = await transcriber(audioData, {
                chunk_length_s: 30,
                stride_length_s: 5,
                language: "english"
            });

            transcriptParts.push(result.text.trim());
        }

        return transcriptParts.join("\n\n");
    } finally {
        await fsPromises.rm(jobDirectory, { recursive: true, force: true });
    }
}

module.exports = transcribeAudio;
