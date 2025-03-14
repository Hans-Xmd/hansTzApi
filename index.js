const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
    const videoURL = req.query.url;

    if (!videoURL || !ytdl.validateURL(videoURL)) {
        return res.status(400).json({ 
            creator: "HansTz",
            status: 400,
            success: false,
            error: "Invalid YouTube URL"
        });
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const videoId = info.videoDetails.videoId;
        const title = info.videoDetails.title;
        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        res.json({
            creator: "HansTz",
            status: 200,
            success: true,
            result: {
                type: "audio",
                quality: "128kbps",
                title: title,
                thumbnail: thumbnail,
                download_url: `https://hans-tz-api.vercel.app/stream?url=${encodeURIComponent(videoURL)}`
            }
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            creator: "HansTz",
            status: 500,
            success: false,
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
