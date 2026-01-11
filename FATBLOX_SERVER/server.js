const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

// Allow connections from your HTML files
app.use(cors());
app.use(express.json());

// --- DATABASE LINKS ---
const SHEETDB_URLS = {
    quiz: 'https://sheetdb.io/api/v1/wwicy7zpjd0r4',
    giveaway: 'https://sheetdb.io/api/v1/zdw6l9g1t1cov',
    spin: 'https://sheetdb.io/api/v1/otf617twr9im8'
};

// --- HELPER FUNCTION TO SEND DATA ---
async function sendToCloud(url, data, res, type) {
    console.log(`[${type}] Receiving Data...`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: [data] })
        });
        
        const result = await response.json();
        console.log(`[${type}] Saved Successfully!`);
        res.json({ success: true, result: result });
        
    } catch (error) {
        console.error(`[${type}] ERROR:`, error.message);
        res.status(500).json({ error: "Failed to save to cloud" });
    }
}

// 1. QUIZ
app.post('/api/quiz', (req, res) => sendToCloud(SHEETDB_URLS.quiz, req.body, res, "QUIZ"));

// 2. GIVEAWAY
app.post('/api/giveaway', (req, res) => sendToCloud(SHEETDB_URLS.giveaway, req.body, res, "GIVEAWAY"));

// 3. SPIN
app.post('/api/spin', (req, res) => {
    // Fix structure for spin if needed
    let finalData = req.body;
    if(req.body.data) finalData = req.body.data[0]; 
    sendToCloud(SHEETDB_URLS.spin, finalData, res, "SPIN");
});

// START SERVER
app.listen(3000, () => {
    console.log("---------------------------------------");
    console.log("✅ SERVER IS RUNNING ON PORT 3000");
    console.log("   Keep this black window OPEN.");
    console.log("---------------------------------------");
});