const path = require("path");
const fs = require("fs/promises");
const ytdlp = require("yt-dlp-exec");

async function extractAudio(url) {
    if (!url) {
        throw new Error("A video URL is required.");
    }

    const downloadsDir = path.resolve(__dirname, "..", "downloads");
    await fs.mkdir(downloadsDir, { recursive: true });
    const outputFile = path.join(downloadsDir, "audio.wav");

    const options = {
        extractAudio: true,
        audioFormat: "wav",
        output: outputFile,
        noPlaylist: true,
        forceOverwrites: true,
        retries: 3,
        // YouTube now requires a JavaScript runtime for reliable extraction.
        // Node is installed with this project, so provide its executable to yt-dlp.
        jsRuntimes: `node:${process.execPath}`
    };

    if (process.env.FFMPEG_PATH) {
        options.ffmpegLocation = process.env.FFMPEG_PATH;
    }

    if (process.env.YTDLP_COOKIES_FROM_BROWSER) {
        options.cookiesFromBrowser = process.env.YTDLP_COOKIES_FROM_BROWSER;
    }

    if (process.env.YTDLP_PO_TOKEN) {
        options.extractorArgs = `youtube:po_token=${process.env.YTDLP_PO_TOKEN}`;
    }

    try {
        await ytdlp(url, options);
    } catch (error) {
        if (/HTTP Error 403/.test(error.stderr || error.message)) {
            throw new Error(
                "YouTube rejected the media download (HTTP 403). " +
                "Set YTDLP_COOKIES_FROM_BROWSER=chrome in .env and retry. " +
                "If YouTube still requires one, add a valid YTDLP_PO_TOKEN as well."
            );
        }
        throw error;
    }

    return outputFile;
}

module.exports = extractAudio;
