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
        process.on("error", error => reject(new Error(`Unable to start FFmpeg: ${error.message}`)));
        process.on("close", code => {
            if (code === 0) resolve();
            else reject(new Error(`FFmpeg failed while splitting audio: ${errorOutput.slice(-1200)}`));
        });
    });
}

async function chunkAudio(inputFile, outputDirectory, chunkSeconds = 300) {
    if (!Number.isFinite(chunkSeconds) || chunkSeconds <= 0) {
        throw new Error("chunkSeconds must be a positive number.");
    }

    const inputPath = path.resolve(inputFile);
    const destination = path.resolve(outputDirectory);
    await fs.access(inputPath);
    await fs.mkdir(destination, { recursive: true });

    await runFfmpeg([
        "-y",
        "-i", inputPath,
        "-f", "segment",
        "-segment_time", String(chunkSeconds),
        "-reset_timestamps", "1",
        "-c", "copy",
        path.join(destination, "chunk-%03d.wav")
    ]);

    const entries = await fs.readdir(destination);
    const chunks = entries
        .filter(file => /^chunk-\d+\.wav$/i.test(file))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map(file => path.join(destination, file));

    if (!chunks.length) throw new Error("FFmpeg did not create any audio chunks.");
    return chunks;
}

module.exports = chunkAudio;
