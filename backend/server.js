const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Buffer file safe loader
const bufferFilePath = path.join(__dirname, 'buffer.json');
let bufferData = [];

if (fs.existsSync(bufferFilePath)) {
  try {
    bufferData = JSON.parse(fs.readFileSync(bufferFilePath, 'utf8'));
  } catch (err) {
    bufferData = [];
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'RESQ-MESH Backend', timestamp: new Date() });
});

// Mock Stats
app.get('/api/stats', (req, res) => {
  res.json({
    activeAlerts: 4,
    dispatchedTeams: 12,
    safeShelters: 8,
    sosSignals: 3
  });
});

// Mock Alerts
app.get('/api/alerts', (req, res) => {
  res.json([
    { id: 1, title: "Severe Flood Warning", level: "Critical", area: "Zone B", time: "10 mins ago" },
    { id: 2, title: "Landslide Risk", level: "Moderate", area: "Northern Hill Route", time: "30 mins ago" }
  ]);
});

// AI Assistant Proxy / Fallback
app.post('/api/ai/query', (req, res) => {
  const { query } = req.body;
  res.json({
    response: `RESQ-MESH AI Assistant: Received "${query || 'Request'}". Emergency routing protocol activated. All local mesh beacons updated.`
  });
});

// SOS Receiver
app.post('/api/sos', (req, res) => {
  const payload = {
    id: Date.now(),
    ...req.body,
    receivedAt: new Date().toISOString()
  };
  bufferData.push(payload);
  try {
    fs.writeFileSync(bufferFilePath, JSON.stringify(bufferData, null, 2));
  } catch (e) {
    console.error("Buffer write error:", e);
  }
  res.status(201).json({ success: true, message: "SOS signal broadcasted via Mesh", data: payload });
});

app.listen(PORT, () => {
  console.log(`[RESQ-MESH Backend] Running smoothly on port ${PORT}`);
});
