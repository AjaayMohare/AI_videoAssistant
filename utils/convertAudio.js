const fs = require("fs/promises");
const path = require("path");
const { spawn } = require("child_process");

function getFfmpegPath() {
    const configuredPath = process.env.FFMPEG_PATH;

    if (!configuredPath) return "ffmpeg";

    return configuredPath.toLowerCase().endsWith(".exe")
        ? configuredPath
        : path.join(configuredPath, "ffmpeg.exe");
}

function runFfmpeg(args) {
    return new Promise((resolve, reject) => {
        const process = spawn(getFfmpegPath(), args, { windowsHide: true });
        let errorOutput = "";

        process.stderr.on("data", data => {
            errorOutput += data.toString();
        });

        process.on("error", error => {
            reject(new Error(`Unable to start FFmpeg: ${error.message}`));
        });

        process.on("close", code => {
            if (code === 0) resolve();
            else reject(new Error(`FFmpeg failed: ${errorOutput.slice(-1200)}`));
        });
    });
}

async function convertAudio(inputFile, outputFile) {
    if (!inputFile) throw new Error("An input audio file is required.");

    const inputPath = path.resolve(inputFile);
    const destination = path.resolve(
        outputFile || path.join(path.dirname(inputPath), "normalized-audio.wav")
    );

    await fs.access(inputPath);
    await fs.mkdir(path.dirname(destination), { recursive: true });

    await runFfmpeg([
        "-y",
        "-i", inputPath,
        "-vn",
        "-ar", "16000",
        "-ac", "1",
        "-c:a", "pcm_s16le",
        destination
    ]);

    return destination;
}

module.exports = convertAudio;
