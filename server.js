const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

const RAPIDAPI_KEY = '97b95adf5cmsh0d5168711a321f1p1ca3aajsn016e53aa01cd';

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    console.log(`Received request for URL: ${videoUrl}`);

    if (!videoUrl) {
        console.log('Error: Video URL is required');
        return res.status(400).json({ error: 'Video URL is required' });
    }

    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) {
        console.log(`Error: Invalid YouTube URL for ${videoUrl}`);
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    console.log(`Extracted video ID: ${videoId}`);

    const apiUrl = `https://social-media-video-downloader.p.rapidapi.com/youtube/v3/video/details?videoId=${videoId}`;

    const options = {
        method: 'GET',
        url: apiUrl,
        headers: {
            'x-rapidapi-host': 'social-media-video-downloader.p.rapidapi.com',
            'x-rapidapi-key': RAPIDAPI_KEY
        }
    };

    try {
        console.log('Making request to RapidAPI...');
        const response = await axios.request(options);
        console.log('Received response from RapidAPI:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from RapidAPI:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An error occurred while fetching video data.' });
    }
});

function getYouTubeVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
