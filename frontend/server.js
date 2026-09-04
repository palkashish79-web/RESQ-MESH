import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory local mesh buffer
let localMeshQueue = [];

// Node Health Check
app.get('/api/node-status', (req, res) => {
    res.json({
        status: 'ONLINE',
        nodeType: 'LOCAL_RELAY_BASE',
        bufferedPackets: localMeshQueue.length
    });
});

// Offline Packet Relay Ingestion Endpoint
app.post('/api/relay-packet', (req, res) => {
    const { sender, location, message, urgency } = req.body;

    if (!sender || !message) {
        return res.status(400).json({ error: 'Missing required payload fields' });
    }

    const packet = {
        id: `RELAY_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        sender,
        location: location || 'Unknown Grid',
        message,
        urgency: urgency || 'High',
        receivedAt: new Date().toISOString(),
        status: 'BUFFERED_ON_RELAY'
    };

    localMeshQueue.push(packet);
    console.log(`[MESH RELAY] Packet buffered: ${packet.id} from ${sender} (${packet.location})`);

    res.status(201).json({
        success: true,
        message: 'Packet safely buffered on local relay node',
        packet
    });
});

// View all buffered packets
app.get('/api/relay-packets', (req, res) => {
    res.json({
        total: localMeshQueue.length,
        packets: localMeshQueue
    });
});

app.listen(PORT, () => {
    console.log(`⚡ ResQ Mesh Local Relay Node active on http://localhost:${PORT}`);
});