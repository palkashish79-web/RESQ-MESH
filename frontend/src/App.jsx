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
    labels: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
  },
  vector: {
    base: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    labels: null
  },
  darkOps: {
    base: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    labels: null
  }
};

const RELAY_CENTER = [26.4499, 80.3319];

export default function App() {
  const [requests, setRequests] = useState([]);
  const [localPackets, setLocalPackets] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('26.4499, 80.3319');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState('Critical');

  const [relayStatus, setRelayStatus] = useState({ online: false, count: 0 });
  const [activeMode, setActiveMode] = useState('hybrid');
  const [isBlackout, setIsBlackout] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [purging, setPurging] = useState(false);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const baseTileRef = useRef(null);
  const labelTileRef = useRef(null);
  const markersRef = useRef([]);
  const linesRef = useRef([]);
  const initialZoomDone = useRef(false);

  // CSS injection
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .resq-custom-marker {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .beacon-core {
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 6px rgba(0,0,0,0.5);
      }
      .beacon-pulse {
        position: absolute;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        animation: sonarPulse 2s infinite ease-out;
      }
      .beacon-pulse.critical { background: rgba(239, 68, 68, 0.45); }
      .beacon-core.critical { background: #ef4444; }
      .beacon-pulse.high { background: rgba(249, 115, 22, 0.45); }
      .beacon-core.high { background: #f97316; }
      .beacon-pulse.normal { background: rgba(59, 130, 246, 0.45); }
      .beacon-core.normal { background: #3b82f6; }
      @keyframes sonarPulse {
        0% { transform: scale(0.4); opacity: 1; }
        100% { transform: scale(2.0); opacity: 0; }
      }
    `;
    document.head.appendChild(styleTag);
    return () => {
      if (document.head.contains(styleTag)) {
        document.head.removeChild(styleTag);
      }
    };
  }, []);

  // 1. Stable Map Init
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      try {
        const map = L.map(mapRef.current, {
          center: RELAY_CENTER,
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
        }, 200);
      } catch (err) {
        console.error("Map init error:", err);
      }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // 2. Layer Mode Switcher
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

  // 3. Local Backend Polling
  const fetchLocalPackets = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/mesh/packets');
      if (res.ok) {
        const data = await res.json();
        if (data.packets) {
          setLocalPackets(data.packets);
        }
      }
    } catch { }
  };

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
    fetchLocalPackets();

    const timer = setInterval(() => {
      checkRelayNode();
      fetchLocalPackets();
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Firestore Live Listener
  useEffect(() => {
    if (isBlackout) return;

    try {
      const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(docs);
      }, () => { });
      return () => unsubscribe();
    } catch { }
  }, [isBlackout]);

  // Combined Incidents
  const combinedIncidents = React.useMemo(() => {
    const mapItems = [...localPackets.map(p => ({
      id: p.id,
      name: p.nodeId || p.sender,
      location: `${p.lat}, ${p.lng}`,
      lat: p.lat,
      lng: p.lng,
      message: p.message,
      urgency: p.severity || 'Critical',
      isLocal: true,
      synced: isBlackout ? false : p.syncedToCloud,
      hops: p.hops || 1
    }))];

    if (!isBlackout) {
      requests.forEach(r => {
        if (!mapItems.some(item => item.id === r.id)) {
          mapItems.push({
            ...r,
            isLocal: false,
            synced: true,
            hops: 1
          });
        }
      });
    }

    return mapItems;
  }, [localPackets, requests, isBlackout]);

  // 4. Stable Markers & Lines
  useEffect(() => {
    if (!mapInstance.current) return;

    markersRef.current.forEach(m => {
      try { m.remove(); } catch (e) { }
    });
    markersRef.current = [];

    linesRef.current.forEach(l => {
      try { l.remove(); } catch (e) { }
    });
    linesRef.current = [];

    const validCoordinates = [];

    // Central Base Marker
    const hqIcon = L.divIcon({
      className: 'resq-custom-marker',
      html: `
        <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
          <div style="width: 14px; height: 14px; background: #38bdf8; border-radius: 4px; border: 2px solid white; box-shadow: 0 0 10px #38bdf8;"></div>
          <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: #0f172a; color: #38bdf8; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; white-space: nowrap; border: 1px solid #38bdf8;">
            📡 RELAY-HQ
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const hqMarker = L.marker(RELAY_CENTER, { icon: hqIcon })
      .addTo(mapInstance.current)
      .bindPopup(`<b>RELAY-KANPUR-PRIMARY</b><br/>Central Ground Mesh Gateway`);
    markersRef.current.push(hqMarker);

    combinedIncidents.forEach(req => {
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
        }

        if (lat !== null && lng !== null && isFinite(lat) && isFinite(lng)) {
          validCoordinates.push([lat, lng]);
          const u = req.urgency === 'Critical' ? 'critical' : req.urgency === 'High' ? 'high' : 'normal';

          // Mesh Line
          if (lat !== RELAY_CENTER[0] || lng !== RELAY_CENTER[1]) {
            const polyline = L.polyline([RELAY_CENTER, [lat, lng]], {
              color: u === 'critical' ? '#ef4444' : '#38bdf8',
              weight: 2,
              opacity: 0.6,
              dashArray: '6, 8'
            }).addTo(mapInstance.current);
            linesRef.current.push(polyline);
          }

          const sonarIcon = L.divIcon({
            className: 'resq-custom-marker',
            html: `
              <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                <div class="beacon-pulse ${u}"></div>
                <div class="beacon-core ${u}"></div>
                <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: rgba(15,23,42,0.95); color: #38bdf8; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; white-space: nowrap; border: 1px solid #38bdf8;">
                  ${String(req.name || req.sender || 'SOS').substring(0, 16)}
                </div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const marker = L.marker([lat, lng], { icon: sonarIcon })
            .addTo(mapInstance.current)
            .bindPopup(`
              <div style="padding: 4px; min-width: 170px; font-family: system-ui;">
                <b>${req.name || 'Emergency Unit'}</b> [${req.urgency}]<br/>
                <span style="font-size: 12px; color: #475569;">${req.message}</span>
              </div>
            `);

          markersRef.current.push(marker);
        }
      } catch (err) {
        console.warn("Marker err:", err);
      }
    });

    try {
      if (!initialZoomDone.current && validCoordinates.length > 0 && mapInstance.current) {
        const bounds = L.latLngBounds([RELAY_CENTER, ...validCoordinates]);
        if (bounds.isValid()) {
          mapInstance.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
          initialZoomDone.current = true;
        }
      }
    } catch { }
  }, [combinedIncidents]);

  // Dispatch Local SOS
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
        await fetchLocalPackets();
        await checkRelayNode();
      }
    } catch (err) {
      alert('Relay node offline: ' + err.message);
    }
  };

  // 1. Manual Force Sync
  const handleForceSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('http://localhost:5000/api/mesh/force-sync', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        console.log(`[FORCE SYNC] Synced ${data.syncedCount || 0} packets!`);
      } else {
        alert(data.reason === 'offline' ? 'Network is offline! Packets held in buffer.' : 'Sync failed');
      }
      await fetchLocalPackets();
      await checkRelayNode();
    } catch (err) {
      alert('Relay gateway offline: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  // 2. Clear Synced Buffer Packets
  const handleClearSynced = async () => {
    setPurging(true);
    try {
      const res = await fetch('http://localhost:5000/api/mesh/clear-synced', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        alert(`Purged ${data.purgedCount || 0} already-synced packets!`);
      }
      await fetchLocalPackets();
      await checkRelayNode();
    } catch (err) {
      alert('Clear buffer error: ' + err.message);
    } finally {
      setPurging(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', fontFamily: 'system-ui, sans-serif', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ color: '#ef4444', margin: 0, fontSize: '24px', fontWeight: 800 }}>
            RESQ MESH &bull; TACTICAL COMMAND
          </h1>
          <p style={{ color: '#64748b', margin: '2px 0 0 0', fontSize: '13px' }}>
            Store-and-Forward Mesh Grid &bull; Live Dynamic Map Node Tracking
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Blackout Toggle */}
          <button
            onClick={() => setIsBlackout(!isBlackout)}
            style={{
              background: isBlackout ? '#dc2626' : '#334155',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {isBlackout ? '🔴 BLACKOUT ACTIVE' : '⚡ SIMULATE BLACKOUT'}
          </button>

          {/* Force Sync Button */}
          <button
            onClick={handleForceSync}
            disabled={syncing}
            style={{
              background: syncing ? '#0369a1' : '#0284c7',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: syncing ? 'not-allowed' : 'pointer'
            }}
          >
            {syncing ? 'SYNCING...' : '⚡ FORCE SYNC NOW'}
          </button>

          {/* Purge Synced Button */}
          <button
            onClick={handleClearSynced}
            disabled={purging}
            style={{
              background: '#475569',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: purging ? 'not-allowed' : 'pointer'
            }}
          >
            {purging ? 'CLEANING...' : '🧹 PURGE BUFFER'}
          </button>

          {/* Map Layer Mode Switcher */}
          <div style={{ background: '#1e293b', padding: '4px', borderRadius: '6px', display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setDisplayMode('hybrid')}
              style={{ background: activeMode === 'hybrid' ? '#0284c7' : 'transparent', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
            >
              Satellite
            </button>
            <button
              onClick={() => setDisplayMode('vector')}
              style={{ background: activeMode === 'vector' ? '#0284c7' : 'transparent', color: '#cbd5e1', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
            >
              Street
            </button>
            <button
              onClick={() => setDisplayMode('darkOps')}
              style={{ background: activeMode === 'darkOps' ? '#0284c7' : 'transparent', color: '#cbd5e1', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
            >
              Dark
            </button>
          </div>
        </div>
      </div>

      {/* Relay Status Bar */}
      <div style={{
        background: relayStatus.online ? '#0f172a' : '#450a0a',
        padding: '12px 16px',
        borderRadius: '8px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div>
          <strong>Relay Gateway: </strong>
          <span style={{ color: relayStatus.online ? '#4ade80' : '#f87171' }}>
            {relayStatus.online ? 'ONLINE & STORE-FORWARD ACTIVE' : 'OFFLINE'}
          </span>
          {relayStatus.online && (
            <span style={{ marginLeft: '10px', background: '#334155', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
              {relayStatus.count} Buffered Packets
            </span>
          )}
        </div>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        style={{
          height: '460px',
          width: '100%',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '1px solid #334155'
        }}
      />

      {/* Forms & List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
        <form onSubmit={handleRelaySend} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Dispatch Local Emergency SOS</h3>
          <input
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Sender / Unit Tag"
            required
          />
          <input
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="GPS Coordinates"
          />
          <select
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
            value={urgency}
            onChange={e => setUrgency(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <textarea
            rows={3}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Situation Report..."
            required
          />
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}>
            Relay Locally (Offline Mesh)
          </button>
        </form>

        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', maxHeight: '420px', overflowY: 'auto' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Live Incident Stream ({combinedIncidents.length})</h3>
          {combinedIncidents.map(req => (
            <div key={req.id} style={{ borderBottom: '1px solid #f1f5f9', padding: '8px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{req.name || req.sender}</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{req.location}</span>
              </div>
              <p style={{ margin: '4px 0', fontSize: '13px' }}>{req.message}</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '10px', background: req.urgency === 'Critical' ? '#fef2f2' : '#fff7ed', color: req.urgency === 'Critical' ? '#dc2626' : '#ea580c', padding: '2px 4px', borderRadius: '3px', fontWeight: 700 }}>
                  {req.urgency}
                </span>
                <span style={{ fontSize: '10px', background: req.synced ? '#dcfce7' : '#ffedd5', color: req.synced ? '#16a34a' : '#c2410c', padding: '2px 4px', borderRadius: '3px', fontWeight: 700 }}>
                  {req.synced ? 'CLOUD SYNCED' : 'BUFFERED LOCAL'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}