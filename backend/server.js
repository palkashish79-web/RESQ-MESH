import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAw3g74qKeJTDts4dqhxXuc5reRjrlADQs",
  authDomain: "resq-mesh-2026.firebaseapp.com",
  projectId: "resq-mesh-2026",
  storageBucket: "resq-mesh-2026.firebasestorage.app",
  messagingSenderId: "79952073506",
  appId: "1:79952073506:web:1a4eb3572224d40bfdcb7b",
  measurementId: "G-P1GWKX7R9R"
};

const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let localMeshQueue = [];

app.get('/api/node-status', (req, res) => {
  res.json({
    status: 'ONLINE',
    nodeType: 'LOCAL_RELAY_BASE',
    bufferedPackets: localMeshQueue.length
  });
});

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
  console.log(`[MESH RELAY] Packet buffered: ${packet.id} from ${sender}`);

  res.status(201).json({
    success: true,
    message: 'Packet safely buffered on local relay node',
    packet
  });
});

app.get('/api/relay-packets', (req, res) => {
  res.json({
    total: localMeshQueue.length,
    packets: localMeshQueue
  });
});

app.post('/api/sync-to-cloud', async (req, res) => {
  if (localMeshQueue.length === 0) {
    return res.json({ message: 'No buffered packets to sync', count: 0 });
  }

  const synced = [];
  const errors = [];

  for (const item of [...localMeshQueue]) {
    try {
      await addDoc(collection(db, 'requests'), {
        name: `[Relayed: ${item.sender}]`,
        location: item.location,
        message: item.message,
        urgency: item.urgency,
        status: 'pending',
        relayedFrom: item.id,
        createdAt: serverTimestamp()
      });
      synced.push(item.id);
    } catch (err) {
      errors.push({ id: item.id, error: err.message });
    }
  }

  localMeshQueue = localMeshQueue.filter(p => !synced.includes(p.id));

  res.json({
    success: true,
    syncedCount: synced.length,
    remainingInBuffer: localMeshQueue.length,
    errors
  });
});

app.listen(PORT, () => {
  console.log(`? ResQ Mesh Local Relay Node active on http://localhost:${PORT}`);
});
