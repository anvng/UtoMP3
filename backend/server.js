const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');
const path = require('path');
const fs = require('fs');

// Initialize environment variables (if any)
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure the downloads directory exists
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

// Define a GET route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the YouTube to MP3 Converter API!');
});

// Define a POST route to handle YouTube video to MP3 conversion
app.post('/convert', async (req, res) => {
    const { videoUrl } = req.body;

    if (!videoUrl) {
        return res.status(400).json({ error: 'No video URL provided' });
    }

    try {
        // Use yt-dlp to download and convert the video
        const result = await ytdlp(videoUrl, {
            format: 'bestaudio',
            extractAudio: true,
            audioFormat: 'mp3',
            output: path.join(downloadsDir, '%(title)s.%(ext)s'),  // Ensure this path is correct
        });

        res.json({ message: 'Conversion started', result });
    } catch (error) {
        res.status(500).json({ error: 'Conversion failed', details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
