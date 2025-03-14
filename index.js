const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
    const videoURL = req.query.url;
    
    if (!videoURL || !ytdl.validateURL(videoURL)) {
        return res.status(400).json({ 
            status: false,
            creator: "HansTz",
            error: "Invalid YouTube URL"
        });
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const videoId = info.videoDetails.videoId;
        const title = info.videoDetails.title;
        const downloadUrl = `https://your-vercel-app.vercel.app/stream?url=${encodeURIComponent(videoURL)}`;

        res.json({
            status: true,
            creator: "HansTz",
            result: {
                downloadUrl: downloadUrl,
                title: title,
                format: "mp3",
                quality: "128kbps"
            }
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            status: false,
            creator: "HansTz",
            error: "Failed to process request"
        });
    }
});

app.get("/stream", async (req, res) => {
    const videoURL = req.query.url;
    if (!videoURL || !ytdl.validateURL(videoURL)) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    try {
        res.setHeader("Content-Disposition", "attachment; filename=audio.mp3");
        res.setHeader("Content-Type", "audio/mpeg");

        ytdl(videoURL, { filter: "audioonly", quality: "highestaudio" }).pipe(res);
    } catch (error) {
        console.error("Error streaming:", error);
        res.status(500).json({ error: "Error streaming audio" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
