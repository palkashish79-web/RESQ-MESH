import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { RouteIcon, NavigationIcon, CheckIcon, AlertTriangleIcon, ChevronRightIcon, ShieldIcon } from './Icons';
import { CircularGauge } from './Gauges';

export const SafeRouteSection = ({ showFullDetails = false }) => {
  const { safeRoutes, setActiveTab } = useDisaster();
  const [activeRouteId, setActiveRouteId] = useState(safeRoutes[0]?.id || 'RT-ALPHA');

  const selectedRoute = safeRoutes.find((r) => r.id === activeRouteId) || safeRoutes[0];

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#06b6d4';
    return '#f59e0b';
  };

  return (
    <div className="card-glass accent-cyan safe-route-section">
      <div className="card-header">
        <div className="card-header-title">
          <div className="header-icon-badge cyan">
            <RouteIcon className="w-4 h-4 text-cyan" />
          </div>
          <span>AI SAFE EVACUATION CORRIDORS</span>
        </div>
        <div className="badge badge-success">
          <CheckIcon className="w-3 h-3" /> HAZARDS FILTERED
        </div>
      </div>

      <div className="card-body">
        {/* Route Selector Tabs */}
        <div className="route-picker-tabs">
          {safeRoutes.map((route) => {
            const isSelected = route.id === activeRouteId;
            const scoreCol = getScoreColor(route.safetyScore);
            return (
              <button
                key={route.id}
                className={`route-tab-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveRouteId(route.id)}
              >
                <div className="tab-btn-title">{route.name.split(':')[0]}</div>
                <div className="tab-btn-score-row">
                  <span className="tab-score-dot" style={{ backgroundColor: scoreCol }}></span>
                  <span className="tab-btn-score" style={{ color: scoreCol }}>
                    Safety: {route.safetyScore}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Route Details Card */}
        {selectedRoute && (
          <div className="route-detail-box">
            <div className="route-detail-header">
              <div className="route-title-wrap">
                <span className="route-code-tag">{selectedRoute.id}</span>
                <h4 className="route-title">{selectedRoute.name}</h4>
                <span className="route-dest">
                  Destination: <strong>{selectedRoute.destination}</strong>
                </span>
              </div>

              {/* Prominent Circular Corridor Safety Gauge */}
              <div className="corridor-safety-gauge-box">
                <CircularGauge
                  value={selectedRoute.safetyScore}
                  size={48}
                  strokeWidth={4.5}
                  color={getScoreColor(selectedRoute.safetyScore)}
                  label={`${selectedRoute.safetyScore}%`}
                />
                <div className="safety-gauge-meta">
                  <span className="safety-gauge-title">CORRIDOR SAFETY</span>
                  <span
                    className="safety-gauge-status"
                    style={{ color: getScoreColor(selectedRoute.safetyScore) }}
                  >
                    {selectedRoute.safetyScore >= 90 ? 'OPTIMAL SAFE' : 'PASSABLE'}
                  </span>
                  <span className="safety-gauge-zone">Active Rerouting</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="route-metrics-bar">
              <div className="r-metric">
                <span className="r-lbl">Estimated Duration</span>
                <span className="r-val">{selectedRoute.estimatedTime}</span>
              </div>
              <div className="r-metric">
                <span className="r-lbl">Distance</span>
                <span className="r-val">{selectedRoute.distance}</span>
              </div>
              <div className="r-metric">
                <span className="r-lbl">Elevation Profile</span>
                <span className="r-val text-cyan">{selectedRoute.elevationProfile}</span>
              </div>
              <div className="r-metric">
                <span className="r-lbl">Corridor Status</span>
                <span className="r-val text-emerald">{selectedRoute.status}</span>
              </div>
            </div>

            {/* Hazards Avoided Highlights with icon */}
            <div className="hazards-avoided-box">
              <div className="hazards-title">
                <ShieldIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI HAZARD AVOIDANCE MATRIX</span>
              </div>
              <ul className="hazards-list">
                {selectedRoute.hazardsAvoided.map((item, idx) => (
                  <li key={idx} className="hazard-avoided-item">
                    <span className="avoided-check">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Turn by Turn Directions with icon */}
            <div className="turn-directions-section">
              <div className="turn-header">
                <NavigationIcon className="w-3 h-3 text-cyan" />
                <span>TURN-BY-TURN GUIDANCE (OFFLINE CACHED)</span>
              </div>
              <div className="turn-steps">
                {selectedRoute.turnByTurn.map((step) => (
                  <div key={step.step} className="turn-step-item">
                    <div className="step-num">{step.step}</div>
                    <div className="step-text">{step.action}</div>
                    <div className="step-tag">
                      {step.safe ? (
                        <span className="tag-safe">CLEAR</span>
                      ) : (
                        <span className="tag-caution">CAUTION</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start GPS Navigation Button */}
            <button className="start-nav-btn" onClick={() => setActiveTab('routes')}>
              <NavigationIcon className="w-4 h-4" />
              <span>LAUNCH LIVE ROUTE HUD & SATELLITE RADAR</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .safe-route-section {
          min-width: 0;
          width: 100%;
        }

        .route-picker-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.85rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.65rem;
          min-width: 0;
        }

        .route-tab-btn {
          flex: 1;
          min-width: 110px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.45rem 0.65rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .route-tab-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
        }

        .route-tab-btn.active {
          background: rgba(6, 182, 212, 0.12);
          border-color: rgba(6, 182, 212, 0.45);
          color: #ffffff;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.15);
        }

        .tab-btn-title {
          font-size: 0.74rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          text-align: left;
        }

        .tab-btn-score-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.15rem;
        }

        .tab-score-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .tab-btn-score {
          font-size: 0.64rem;
          font-family: var(--font-mono);
          font-weight: 700;
        }

        .route-detail-box {
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 0;
        }

        .route-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.65rem;
          min-width: 0;
        }

        .route-title-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
          flex: 1;
        }

        .route-code-tag {
          font-size: 0.58rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: var(--cyan);
          letter-spacing: 0.05em;
        }

        .route-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.25;
          overflow-wrap: break-word;
        }

        .route-dest {
          font-size: 0.68rem;
          color: var(--text-muted);
          overflow-wrap: break-word;
        }

        .route-dest strong {
          color: #f1f5f9;
        }

        .corridor-safety-gauge-box {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: var(--radius-sm);
          padding: 0.35rem 0.65rem;
          flex-shrink: 0;
        }

        .safety-gauge-meta {
          display: flex;
          flex-direction: column;
          gap: 0.06rem;
        }

        .safety-gauge-title {
          font-size: 0.54rem;
          font-weight: 800;
          color: var(--text-dim);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .safety-gauge-status {
          font-size: 0.7rem;
          font-weight: 800;
          font-family: var(--font-mono);
          letter-spacing: 0.02em;
        }

        .safety-gauge-zone {
          font-size: 0.55rem;
          color: var(--text-muted);
        }

        .route-metrics-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(95px, 1fr));
          gap: 0.45rem;
          background: #050812;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.45rem 0.65rem;
          min-width: 0;
        }

        .r-metric {
          display: flex;
          flex-direction: column;
          gap: 0.08rem;
          min-width: 0;
        }

        .r-lbl {
          font-size: 0.56rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          white-space: nowrap;
        }

        .r-val {
          font-size: 0.74rem;
          font-weight: 700;
          color: #ffffff;
          overflow-wrap: break-word;
        }

        .hazards-avoided-box {
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: var(--radius-sm);
          padding: 0.55rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          min-width: 0;
        }

        .hazards-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #34d399;
          text-transform: uppercase;
        }

        .hazards-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }

        .hazard-avoided-item {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-size: 0.7rem;
          color: #cbd5e1;
          line-height: 1.35;
          overflow-wrap: break-word;
        }

        .avoided-check {
          color: #34d399;
          font-weight: 800;
          flex-shrink: 0;
        }

        .turn-directions-section {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          min-width: 0;
        }

        .turn-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.64rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--cyan);
          text-transform: uppercase;
        }

        .turn-steps {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          min-width: 0;
        }

        .turn-step-item {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          background: #050812;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.35rem 0.6rem;
          min-width: 0;
        }

        .step-num {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(6, 182, 212, 0.18);
          color: var(--cyan);
          font-size: 0.62rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-text {
          flex: 1;
          font-size: 0.72rem;
          color: #f1f5f9;
          min-width: 0;
          overflow-wrap: break-word;
        }

        .step-tag {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }

        .tag-safe {
          color: #34d399;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 0.12rem 0.35rem;
          border-radius: 3px;
        }

        .tag-caution {
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.25);
          padding: 0.12rem 0.35rem;
          border-radius: 3px;
        }

        .start-nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          width: 100%;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0.1) 100%);
          border: 1px solid var(--cyan);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 0.52rem 0.85rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .start-nav-btn:hover {
          background: var(--cyan);
          color: #080c16;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.45);
        }
      `}</style>
    </div>
  );
};
export default SafeRouteSection;
