import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import L from 'leaflet';

const PROVIDERS = {
  hybrid: {
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    labels: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    name: 'Realistic Hybrid (Google Style)'
  },
  vector: {
    base: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    labels: null,
    name: 'Clean Vector Street'
  },
  darkOps: {
    base: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    labels: null,
    name: 'Night Tactical Ops'
  }
};

export default function App() {
  const [requests, setRequests] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('26.4499, 80.3319');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState('Critical');

  const [relayStatus, setRelayStatus] = useState({ online: false, count: 0 });
  const [syncing, setSyncing] = useState(false);
  const [activeMode, setActiveMode] = useState('hybrid');

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const baseTileRef = useRef(null);
  const labelTileRef = useRef(null);
  const markersRef = useRef([]);

  // 1. Safe Leaflet Map Initialization
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      try {
        const map = L.map(mapRef.current, {
          center: [26.4499, 80.3319],
          zoom: 13,
          zoomControl: true,
          attributionControl: false
        });

        baseTileRef.current = L.tileLayer(PROVIDERS.hybrid.base, {
          maxZoom: 19,
          subdomains: ['a', 'b', 'c']
        }).addTo(map);

        labelTileRef.current = L.tileLayer(PROVIDERS.hybrid.labels, {
          maxZoom: 19
        }).addTo(map);

        mapInstance.current = map;

        setTimeout(() => {
          if (mapInstance.current) {
            mapInstance.current.invalidateSize();
          }
        }, 300);
      } catch (err) {
        console.error("Map init error:", err);
      }
    }

    return () => {
      // Clean cleanup on unmount
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // 2. Layer Mode switcher
  const setDisplayMode = (modeKey) => {
    setActiveMode(modeKey);
    if (!mapInstance.current) return;

    try {
      if (baseTileRef.current) mapInstance.current.removeLayer(baseTileRef.current);
      if (labelTileRef.current) {
        mapInstance.current.removeLayer(labelTileRef.current);
        labelTileRef.current = null;
      }

      baseTileRef.current = L.tileLayer(PROVIDERS[modeKey].base, { maxZoom: 19 }).addTo(mapInstance.current);

      if (PROVIDERS[modeKey].labels) {
        labelTileRef.current = L.tileLayer(PROVIDERS[modeKey].labels, { maxZoom: 19 }).addTo(mapInstance.current);
      }
    } catch (err) {
      console.error("Layer switch error:", err);
    }
  };

  // 3. Robust Markers Renderer (Crash-proof coordinates parser)
  useEffect(() => {
    if (!mapInstance.current) return;

    // Purane markers remove karein
    markersRef.current.forEach(m => {
      try { m.remove(); } catch (e) { }
    });
    markersRef.current = [];

    const validCoordinates = [];

    requests.forEach(req => {
      try {
        let lat = null;
        let lng = null;
        const rawLoc = req.location || req.coordinates || req.gps;

        if (rawLoc && typeof rawLoc === 'string' && rawLoc.includes(',')) {
          const parts = rawLoc.split(',').map(p => parseFloat(p.trim()));
          if (!isNaN(parts[0]) && !isNaN(parts[1]) && isFinite(parts[0]) && isFinite(parts[1])) {
            lat = parts[0];
            lng = parts[1];
          }
        } else if (req.lat && req.lng) {
          const pLat = parseFloat(req.lat);
          const pLng = parseFloat(req.lng);
          if (!isNaN(pLat) && !isNaN(pLng)) {
            lat = pLat;
            lng = pLng;
          }
        } else if (rawLoc && typeof rawLoc === 'string') {
          const lower = rawLoc.toLowerCase();
          if (lower.includes('collectorate')) {
            lat = 26.4712; lng = 80.3421;
          } else if (lower.includes('grid') || lower.includes('sector')) {
            lat = 26.4600; lng = 80.3200;
          } else {
            lat = 26.4499; lng = 80.3319;
          }
        }

        if (lat !== null && lng !== null && isFinite(lat) && isFinite(lng)) {
          validCoordinates.push([lat, lng]);
          const u = req.urgency === 'Critical' ? 'critical' : req.urgency === 'High' ? 'high' : 'normal';

          const sonarIcon = L.divIcon({
            className: 'resq-custom-marker',
            html: `
              <div style="position: relative; width: 20px; height: 20px;">
                <div class="beacon-pulse ${u}"></div>
                <div class="beacon-core ${u}"></div>
                <div style="position: absolute; top: -18px; left: 50%; transform: translateX(-50%); background: rgba(15,23,42,0.9); color: #38bdf8; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; white-space: nowrap; border: 1px solid #38bdf8;">
                  ${String(req.name || req.sender || 'SOS').substring(0, 15)}
                </div>
              </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          const marker = L.marker([lat, lng], { icon: sonarIcon })
            .addTo(mapInstance.current)
            .bindPopup(`
              <div style="padding: 4px; min-width: 170px;">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                  <span style="font-weight: 800; color: #38bdf8; font-size: 13px;">${req.name || req.sender || 'Emergency Unit'}</span>
                  <span style="background: ${u === 'critical' ? '#dc2626' : '#f97316'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase;">
                    ${req.urgency || 'CRITICAL'}
                  </span>
                </div>
                <div style="margin: 6px 0; font-size: 12px; color: #cbd5e1; line-height: 1.4;">
                  ${req.message || ''}
                </div>
                <div style="font-size: 11px; color: #94a3b8; font-family: monospace;">
                  📍 GPS: [${lat.toFixed(4)}, ${lng.toFixed(4)}]
                </div>
              </div>
            `);

          markersRef.current.push(marker);
        }
      } catch (err) {
        console.warn("Skipping bad marker:", err);
      }
    });

    // Safe bounds zoom: only if valid points exist
    try {
      if (validCoordinates.length > 0 && mapInstance.current) {
        const bounds = L.latLngBounds(validCoordinates);
        if (bounds.isValid()) {
          mapInstance.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
        }
      }
    } catch (boundsErr) {
      console.warn("Bounds adjust skipped:", boundsErr);
    }
  }, [requests]);

  // Check local relay status
  const checkRelayNode = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/node-status');
      if (res.ok) {
        const data = await res.json();
        setRelayStatus({ online: true, count: data.bufferedPackets || 0 });
      } else {
        setRelayStatus({ online: false, count: 0 });
      }
    } catch {
      setRelayStatus({ online: false, count: 0 });
    }
  };

  useEffect(() => {
    checkRelayNode();
    const timer = setInterval(checkRelayNode, 3000);
    return () => clearInterval(timer);
  }, []);

  // Firestore live listener
  useEffect(() => {
    try {
      const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(docs);
      }, (error) => {
        console.error("Firestore listener error:", error);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Firestore setup error:", e);
    }
  }, []);

  // Dispatch SOS locally
  const handleRelaySend = async (e) => {
    e.preventDefault();
    if (!name || !message) return;

    try {
      const res = await fetch('http://localhost:5000/api/relay-packet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: name,
          location: location || '26.4499, 80.3319',
          message,
          urgency
        })
      });

      if (res.ok) {
        setName('');
        setMessage('');
        checkRelayNode();
        alert('Packet safely buffered in Local Relay node!');
      }
    } catch (err) {
      alert('Relay connection error: ' + err.message);
    }
  };

  // Sync buffer to cloud
  const handleCloudSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('http://localhost:5000/api/sync-to-cloud', { method: 'POST' });
      const data = await res.json();
      alert(`Flushed to Cloud! Synced: ${data.syncedCount || 0}`);
      checkRelayNode();
    } catch (err) {
      alert('Sync fail: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ color: '#ef4444', margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            RESQ MESH &bull; COMMAND CENTER
          </h1>
          <p style={{ color: '#64748b', margin: '2px 0 0 0', fontSize: '13px' }}>
            Store-and-Forward Emergency Grid &mdash; High Resolution Geospatial Feed
          </p>
        </div>

        {/* View Switcher */}
        <div style={{ background: '#1e293b', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setDisplayMode('hybrid')}
            style={{
              background: activeMode === 'hybrid' ? '#0284c7' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🛰️ Real Satellite + Roads
          </button>
          <button
            onClick={() => setDisplayMode('vector')}
            style={{
              background: activeMode === 'vector' ? '#0284c7' : 'transparent',
              color: '#cbd5e1',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🗺️ Google Street
          </button>
          <button
            onClick={() => setDisplayMode('darkOps')}
            style={{
              background: activeMode === 'darkOps' ? '#0284c7' : 'transparent',
              color: '#cbd5e1',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🕶️ Dark Tactical
          </button>
        </div>
      </div>

      {/* Relay Gateway Status */}
      <div style={{
        background: relayStatus.online ? '#0f172a' : '#450a0a',
        border: `1px solid ${relayStatus.online ? '#334155' : '#b91c1c'}`,
        padding: '12px 18px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            height: '10px',
            width: '10px',
            borderRadius: '50%',
            background: relayStatus.online ? '#22c55e' : '#ef4444',
            boxShadow: relayStatus.online ? '0 0 8px #22c55e' : '0 0 8px #ef4444'
          }} />
          <strong style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Relay Gateway (Port 5000):</strong>
          <span style={{ color: relayStatus.online ? '#4ade80' : '#f87171', fontWeight: 700, fontSize: '13px' }}>
            {relayStatus.online ? 'ONLINE & READY' : 'OFFLINE'}
          </span>
          {relayStatus.online && (
            <span style={{ background: '#1e293b', border: '1px solid #475569', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', color: '#94a3b8' }}>
              {relayStatus.count} Packets in Buffer
            </span>
          )}
        </div>

        <button
          onClick={handleCloudSync}
          disabled={!relayStatus.online || relayStatus.count === 0 || syncing}
          style={{
            background: relayStatus.count > 0 ? '#ef4444' : '#334155',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: relayStatus.count > 0 ? 'pointer' : 'not-allowed',
            fontWeight: 800,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {syncing ? 'Syncing...' : `Flush ${relayStatus.count} to Cloud`}
        </button>
      </div>

      {/* Map View */}
      <div
        ref={mapRef}
        style={{
          height: '460px',
          width: '100%',
          borderRadius: '12px',
          border: '1px solid #334155',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}
      />

      {/* Action Deck */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '20px' }}>

        {/* Offline Form */}
        <form onSubmit={handleRelaySend} style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#0f172a' }}>Dispatch Local Emergency SOS</h3>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Sender / Unit Tag:</label>
            <input
              style={{ width: '100%', padding: '10px', marginTop: '4px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. NDRF Team Alpha"
              required
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>GPS Coordinates (Lat, Lng):</label>
            <input
              style={{ width: '100%', padding: '10px', marginTop: '4px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="26.4499, 80.3319"
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Urgency Level:</label>
            <select
              style={{ width: '100%', padding: '10px', marginTop: '4px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              value={urgency}
              onChange={e => setUrgency(e.target.value)}
            >
              <option value="Low">Low - Logistics / Status</option>
              <option value="Medium">Medium - Water / Food Shortage</option>
              <option value="High">High - Medical Kit / Evacuation</option>
              <option value="Critical">Critical - Life Threat / Trauma</option>
            </select>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Situation Report / Request:</label>
            <textarea
              rows={3}
              style={{ width: '100%', padding: '10px', marginTop: '4px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Detail required emergency aid..."
              required
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase' }}>
            Relay Locally (Offline Mesh)
          </button>
        </form>

        {/* Live Stream */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Live Cloud Feed</h3>
            <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
              {requests.length} Incident Signals
            </span>
          </div>

          <div style={{ maxHeight: '390px', overflowY: 'auto' }}>
            {requests.map(req => (
              <div key={req.id} style={{ borderBottom: '1px solid #f1f5f9', padding: '12px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>{req.name || req.sender}</strong>
                  <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{req.location || req.coordinates}</span>
                </div>
                <p style={{ margin: '6px 0', fontSize: '13px', color: '#334155' }}>{req.message}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: req.urgency === 'Critical' ? '#dc2626' : '#ea580c',
                    background: req.urgency === 'Critical' ? '#fef2f2' : '#fff7ed',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {req.urgency || 'CRITICAL'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}