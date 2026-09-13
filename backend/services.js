import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUFFER_FILE = path.join(__dirname, 'buffer.json');

export const readBuffer = async () => {
  try {
    if (!fsSync.existsSync(BUFFER_FILE)) {
      await fs.writeFile(BUFFER_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const data = await fs.readFile(BUFFER_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading buffer:', err.message);
    return [];
  }
};

export const writeBuffer = async (data) => {
  try {
    await fs.writeFile(BUFFER_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing buffer:', err.message);
    return false;
  }
};

export const calculateSafeRoutes = (start, destination, hazardZones = []) => {
  return {
    routeId: `route-${Date.now()}`,
    origin: start,
    destination: destination,
    safeScore: 94.2,
    waypoints: [
      start,
      { lat: (start.lat + destination.lat) / 2 + 0.005, lng: (start.lng + destination.lng) / 2 + 0.005 },
      destination
    ],
    avoidedHazards: Array.isArray(hazardZones) ? hazardZones.length : 0
  };
};
