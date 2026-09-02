import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { MAP_NODES } from '../data/mockData';
import { MapIcon, MapPinIcon, ShelterIcon, AlertTriangleIcon, LayersIcon, ShieldIcon, NavigationIcon } from '../components/Icons';

export const RiskMapPage = () => {
  const { scenario, shelters, setActiveTab } = useDisaster();
  const [selectedPin, setSelectedPin] = useState(MAP_NODES[0]);
  const [showFloodLayer, setShowFloodLayer] = useState(true);
  const [showShelterLayer, setShowShelterLayer] = useState(true);
  const [showHazardLayer, setShowHazardLayer] = useState(true);
  const [showUnitLayer, setShowUnitLayer] = useState(true);

  const getPinColor = (type, status) => {
    if (type === 'shelter') return '#10b981';
    if (type === 'hazard') return '#ef4444';
    if (type === 'unit') return '#06b6d4';
    return '#f59e0b';
  };

  return (
    <div className="risk-map-page">
      {/* Map Control Toolbar */}
      <div className="map-toolbar card-glass">
        <div className="toolbar-left">
          <div className="map-title-wrap">
            <MapIcon className="w-5 h-5 text-cyan" />
            <h2 className="map-title">GIS HAZARD & EVACUATION RADAR</h2>
          </div>
          <span className="live-pill">
            <span className="blinking">●</span> SATELLITE TELEMETRY ACTIVE
          </span>
        </div>

        <div className="layer-toggles">
          <button
            className={`layer-btn ${showFloodLayer ? 'active' : ''}`}
            onClick={() => setShowFloodLayer(!showFloodLayer)}
          >
            🌊 Flood Surge Zone
          </button>
          <button
            className={`layer-btn ${showShelterLayer ? 'active' : ''}`}
            onClick={() => setShowShelterLayer(!showShelterLayer)}
          >
            🏠 Shelters
          </button>
          <button
            className={`layer-btn ${showHazardLayer ? 'active' : ''}`}
            onClick={() => setShowHazardLayer(!showHazardLayer)}
          >
            ⚠️ Hazard Blocks
          </button>
          <button
            className={`layer-btn ${showUnitLayer ? 'active' : ''}`}
            onClick={() => setShowUnitLayer(!showUnitLayer)}
          >
            🚤 Rescue Fleet
          </button>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="map-viewport-wrapper">
        <div className="map-canvas-container">
          {/* Simulated Radar Grid & Terrain */}
          <div className="radar-grid-bg">
            <div className="radar-sweep-line"></div>
          </div>

          {/* SVG Hazard Polygons & Evacuation Corridors */}
          <svg className="map-vector-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* High Hazard Inundation Zone */}
            {showFloodLayer && (
              <polygon
                points="10,80 40,88 75,70 95,90 95,98 5,98"
                fill="rgba(239, 68, 68, 0.22)"
                stroke="#ef4444"
                strokeWidth="0.6"
                strokeDasharray="1.5 1.5"
              />
            )}

            {/* Moderate Surge Buffer Zone */}
            {showFloodLayer && (
              <polygon
                points="15,55 55,62 85,45 95,65 95,90 10,80"
                fill="rgba(245, 158, 11, 0.12)"
                stroke="#f59e0b"
                strokeWidth="0.4"
              />
            )}

            {/* Safe Elevated Ridge (High Ground) */}
            <polygon
              points="10,5 90,5 90,35 60,30 20,40"
              fill="rgba(16, 185, 129, 0.1)"
              stroke="#10b981"
              strokeWidth="0.4"
            />

            {/* Evacuation Route Alpha Path */}
            <polyline
              points="20,75 35,50 62,38"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="2 1"
            />
          </svg>

          {/* Map Nodes / Pinpoints */}
          {MAP_NODES.map((node) => {
            if (node.type === 'shelter' && !showShelterLayer) return null;
            if (node.type === 'hazard' && !showHazardLayer) return null;
            if (node.type === 'unit' && !showUnitLayer) return null;

            const isSelected = selectedPin?.id === node.id;
            const color = getPinColor(node.type, node.status);

            return (
              <div
                key={node.id}
                className={`map-pin-node ${isSelected ? 'is-selected' : ''}`}
                style={{ top: `${node.lat}%`, left: `${node.lng}%` }}
                onClick={() => setSelectedPin(node)}
              >
                <div
                  className="pin-marker-body"
                  style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
                >
                  {node.type === 'shelter' ? '🏠' : node.type === 'hazard' ? '⚠️' : node.type === 'unit' ? '🚤' : '📊'}
                </div>
                <div className="pin-popup-tag">
                  <span>{node.name}</span>
                </div>
              </div>
            );
          })}

          {/* Compass Rose */}
          <div className="compass-rose">
            <div className="compass-n">N</div>
            <div className="compass-needle"></div>
          </div>

          {/* Legend */}
          <div className="map-legend card-glass">
            <div className="legend-item">
              <span className="legend-color bg-danger"></span>
              <span>Submerged Hazard Zone</span>
            </div>
            <div className="legend-item">
              <span className="legend-color bg-warning"></span>
              <span>Moderate Risk Buffer</span>
            </div>
            <div className="legend-item">
              <span className="legend-color bg-success"></span>
              <span>High-Ground Safe Zone</span>
            </div>
            <div className="legend-item">
              <span className="legend-line bg-cyan"></span>
              <span>Corridor Alpha (Clear)</span>
            </div>
          </div>
        </div>

        {/* Selected Node Inspector Sidepanel */}
        {selectedPin && (
          <div className="node-inspector-panel card-glass">
            <div className="inspector-header">
              <span className="inspector-tag" style={{ color: getPinColor(selectedPin.type) }}>
                {selectedPin.type.toUpperCase()} TELEMETRY
              </span>
              <h3 className="inspector-name">{selectedPin.name}</h3>
            </div>

            <div className="inspector-body">
              <div className="insp-row">
                <span className="insp-key">Status Tag</span>
                <span className="insp-val">{selectedPin.label}</span>
              </div>
              <div className="insp-row">
                <span className="insp-key">Coordinates</span>
                <span className="insp-val text-cyan">
                  {(18.5 + selectedPin.lat * 0.001).toFixed(4)}° N, {(73.8 + selectedPin.lng * 0.001).toFixed(4)}° E
                </span>
              </div>
              <div className="insp-row">
                <span className="insp-key">Hazard Vector</span>
                <span className="insp-val">{scenario.keyHazard}</span>
              </div>

              <div className="inspector-actions">
                {selectedPin.type === 'shelter' ? (
                  <button className="btn-insp-action" onClick={() => setActiveTab('routes')}>
                    <NavigationIcon className="w-4 h-4" />
                    <span>Navigate to this Shelter</span>
                  </button>
                ) : (
                  <button className="btn-insp-action" onClick={() => setActiveTab('alerts')}>
                    <AlertTriangleIcon className="w-4 h-4" />
                    <span>View Hazard Advisory</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .risk-map-page {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .map-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .map-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .map-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
        }

        .live-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--cyan);
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.3);
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
        }

        .layer-toggles {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .layer-btn {
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-family: var(--font-main);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .layer-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        .layer-btn.active {
          background: rgba(6, 182, 212, 0.15);
          border-color: var(--cyan);
          color: #ffffff;
        }

        .map-viewport-wrapper {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 1rem;
          min-height: 580px;
        }

        .map-canvas-container {
          position: relative;
          background: #060b14;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.7);
        }

        .radar-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 70%);
          background-size: 40px 40px, 40px 40px, 100% 100%;
        }

        .radar-sweep-line {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 250px;
          height: 250px;
          transform-origin: top left;
          background: conic-gradient(from 0deg, rgba(6, 182, 212, 0.25) 0deg, transparent 60deg);
          animation: radar-sweep 5s infinite linear;
          pointer-events: none;
        }

        .map-vector-overlay {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .map-pin-node {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
          z-index: 10;
          transition: transform 0.2s ease;
        }

        .map-pin-node:hover, .map-pin-node.is-selected {
          transform: translate(-50%, -50%) scale(1.25);
          z-index: 20;
        }

        .pin-marker-body {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          border: 2px solid #ffffff;
        }

        .pin-popup-tag {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          white-space: nowrap;
          pointer-events: none;
          margin-bottom: 4px;
        }

        .compass-rose {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.75rem;
          color: var(--danger);
        }

        .map-legend {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          padding: 0.65rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.72rem;
          color: var(--text-secondary);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .legend-line {
          width: 14px;
          height: 3px;
          border-radius: 2px;
        }

        .bg-danger { background: var(--danger); }
        .bg-warning { background: var(--warning); }
        .bg-success { background: var(--success); }
        .bg-cyan { background: var(--cyan); }

        .node-inspector-panel {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .inspector-tag {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .inspector-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
          margin-top: 0.2rem;
        }

        .inspector-body {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .insp-row {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .insp-key {
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .insp-val {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
        }

        .inspector-actions {
          margin-top: 1rem;
        }

        .btn-insp-action {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          background: var(--cyan);
          border: none;
          color: #080c16;
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 800;
          padding: 0.65rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        @media (max-width: 960px) {
          .map-viewport-wrapper {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
