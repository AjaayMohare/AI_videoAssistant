require("dotenv").config();
const fs = require("fs");
const path = require("path");

const extractAudio = require("./utils/extractAudio");
const transcribeAudio = require("./transcription/transcribeAudio");

const generateTitle = require("./summarization/generateTitle");
const summarize = require("./summarization/summarize");

const extractActionItems = require("./extraction/extractActionItems");
const extractDecisions = require("./extraction/extractDecisions");
const extractQuestions = require("./extraction/extractQuestions");

const buildVectorStore = require("./rag/buildVectorStore");
const askQuestion = require("./rag/askQuestion");

async function main() {
    const args = process.argv.slice(2);
    const usingAudioFile = args[0] === "--audio";
    const url = usingAudioFile ? null : args[0];
    let audioFile;

    if (usingAudioFile) {
        audioFile = path.resolve(args[1] || "");
        if (!args[1] || !fs.existsSync(audioFile)) {
            console.error("Usage: npm start -- --audio <path-to-wav-file>");
            process.exitCode = 1;
            return;
        }
    } else if (!url) {
        console.error("Usage: npm start -- <YouTube video URL>");
        console.error("   or: npm start -- --audio <path-to-wav-file>");
        process.exitCode = 1;
        return;
    }

    if (audioFile) {
        console.log(`Using local audio: ${audioFile}`);
    } else {
        console.log("Downloading audio...");
        audioFile = await extractAudio(url);
    }

    console.log("Transcribing...");

    const transcript = await transcribeAudio(audioFile);

    console.log("Generating title...");

    const title = await generateTitle(transcript);

    console.log("Generating summary...");

    const summary = await summarize(transcript);

    console.log("Extracting action items...");

    const actionItems = await extractActionItems(transcript);

    console.log("Extracting decisions...");

    const decisions = await extractDecisions(transcript);

    console.log("Extracting questions...");

    const questions = await extractQuestions(transcript);

    console.log("Building RAG...");

    const vectorStore = await buildVectorStore(transcript);

    console.log("\n==============================");
    console.log("TITLE");
    console.log("==============================");
    console.log(title);

    console.log("\nSUMMARY");
    console.log("==============================");
    console.log(summary);

    console.log("\nACTION ITEMS");
    console.log("==============================");
    console.log(actionItems);

    console.log("\nDECISIONS");
    console.log("==============================");
    console.log(decisions);

    console.log("\nQUESTIONS");
    console.log("==============================");
    console.log(questions);

    while (true) {
        const readline = require("readline");

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = await new Promise(resolve => {
            rl.question("\nAsk: ", answer => {
                rl.close();
                resolve(answer);
            });
        });

        if (
            question.toLowerCase() === "exit" ||
            question.toLowerCase() === "quit"
        ) {
            break;
        }

        const answer = await askQuestion(question, vectorStore);

        console.log("\nAssistant:", answer);
    }
}

main().catch(error => {
    console.error("\nUnable to process the video:", error.message);
    process.exitCode = 1;
});
