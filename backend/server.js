import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './firebase.js';
import { readBuffer, writeBuffer, calculateSafeRoutes } from './services.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Buffer queue for offline mesh sync
app.get('/api/buffer', async (req, res) => {
  try {
    const queue = await readBuffer();
    res.status(200).json({ success: true, data: queue });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/buffer', async (req, res) => {
  try {
    const newItem = {
      id: `buf-${Date.now()}`,
      timestamp: Date.now(),
      synced: false,
      ...req.body
    };
    const queue = await readBuffer();
    queue.push(newItem);
    await writeBuffer(queue);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Alerts API
app.get('/api/alerts', async (req, res) => {
  if (db) {
    try {
      const snapshot = await db.collection('alerts').orderBy('timestamp', 'desc').limit(20).get();
      const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ success: true, data: alerts });
    } catch (err) {
      console.warn('[Firestore] Error fetching live alerts, falling back to local storage:', err.message);
    }
  }

  const fallbackAlerts = [
    { id: 'alt-1', title: 'Severe Flood Warning', severity: 'Critical', region: 'Sector 4', timestamp: '10 mins ago', source: 'Hydrological Sensor' },
    { id: 'alt-2', title: 'Power Grid Failure', severity: 'High', region: 'Downtown Hub', timestamp: '25 mins ago', source: 'Mesh Node #12' }
  ];
  return res.status(200).json({ success: true, data: fallbackAlerts });
});

app.post('/api/alerts', async (req, res) => {
  const alertData = {
    ...req.body,
    timestamp: req.body.timestamp || Date.now()
  };

  if (db) {
    try {
      const ref = await db.collection('alerts').add(alertData);
      return res.status(201).json({ success: true, id: ref.id, ...alertData });
    } catch (err) {
      console.error('[Firestore] Save error:', err.message);
    }
  }

  try {
    const queue = await readBuffer();
    queue.push({ id: `alert-${Date.now()}`, ...alertData });
    await writeBuffer(queue);
    return res.status(201).json({ success: true, fallbackStored: true, data: alertData });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Safe Routes Endpoint
app.post('/api/safe-routes', (req, res) => {
  const { start, destination, hazards } = req.body;
  if (!start || !destination) {
    return res.status(400).json({ success: false, error: 'Start and destination coordinates are required' });
  }
  const computed = calculateSafeRoutes(start, destination, hazards || []);
  return res.status(200).json({ success: true, route: computed });
});

app.listen(PORT, () => {
  console.log(`[RESQ-MESH API] Running on port ${PORT}`);
});
