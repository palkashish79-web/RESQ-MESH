import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { RouteIcon, NavigationIcon, CheckIcon, AlertTriangleIcon, ChevronRightIcon } from './Icons';

export const SafeRouteSection = ({ showFullDetails = false }) => {
  const { safeRoutes, setActiveTab } = useDisaster();
  const [activeRouteId, setActiveRouteId] = useState(safeRoutes[0]?.id || 'RT-ALPHA');

  const selectedRoute = safeRoutes.find((r) => r.id === activeRouteId) || safeRoutes[0];

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
          {safeRoutes.map((route) => (
            <button
              key={route.id}
              className={`route-tab-btn ${route.id === activeRouteId ? 'active' : ''}`}
              onClick={() => setActiveRouteId(route.id)}
            >
              <div className="tab-btn-title">{route.name.split(':')[0]}</div>
              <div className="tab-btn-score">Safety: {route.safetyScore}%</div>
            </button>
          ))}
        </div>

        {/* Active Route Details Card */}
        {selectedRoute && (
          <div className="route-detail-box">
            <div className="route-detail-header">
              <div className="route-title-wrap">
                <h4 className="route-title">{selectedRoute.name}</h4>
                <span className="route-dest">Destination: <strong>{selectedRoute.destination}</strong></span>
              </div>
              <div className="corridor-safety-gauge-box">
                <div className="radial-gauge-wrap">
                  <svg className="radial-gauge-svg" width="40" height="40" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="3.4"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={selectedRoute.safetyScore >= 90 ? '#34d399' : selectedRoute.safetyScore >= 75 ? '#38bdf8' : '#fbbf24'}
                      strokeWidth="3.4"
                      strokeDasharray={`${selectedRoute.safetyScore}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="radial-gauge-label">
                    <span className="corridor-gauge-num">{selectedRoute.safetyScore}%</span>
                  </div>
                </div>
                <div className="safety-gauge-meta">
                  <span className="safety-gauge-title">SAFETY RATING</span>
                  <span
                    className="safety-gauge-status"
                    style={{
                      color: selectedRoute.safetyScore >= 90 ? '#34d399' : '#38bdf8'
                    }}
                  >
                    {selectedRoute.safetyScore >= 90 ? 'OPTIMAL' : 'CLEAR'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
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

            {/* Hazards Avoided Highlights */}
            <div className="hazards-avoided-box">
              <div className="hazards-title">
                <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI ROUTE HAZARDS PROACTIVELY AVOIDED</span>
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

            {/* Turn by Turn Directions */}
            <div className="turn-directions-section">
              <div className="turn-header">TURN-BY-TURN EVACUATION GUIDANCE</div>
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
              <NavigationIcon className="w-3.5 h-3.5" />
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
          gap: 0.4rem;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.55rem;
          min-width: 0;
        }

        .route-tab-btn {
          flex: 1;
          min-width: 100px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.38rem 0.55rem;
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
          border-color: rgba(6, 182, 212, 0.4);
          color: #ffffff;
        }

        .tab-btn-title {
          font-size: 0.72rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        .tab-btn-score {
          font-size: 0.62rem;
          color: var(--cyan);
          font-family: var(--font-mono);
          font-weight: 600;
        }

        .route-detail-box {
          background: #090f1e;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          min-width: 0;
        }

        .route-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          min-width: 0;
        }

        .route-title-wrap {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .route-title {
          font-size: 0.8rem;
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
          color: var(--cyan);
        }

        .corridor-safety-gauge-box {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-sm);
          padding: 0.3rem 0.6rem;
          flex-shrink: 0;
        }

        .corridor-gauge-num {
          font-size: 0.58rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: #34d399;
        }

        .safety-gauge-meta {
          display: flex;
          flex-direction: column;
          gap: 0.08rem;
        }

        .safety-gauge-title {
          font-size: 0.5rem;
          font-weight: 800;
          color: var(--text-dim);
          letter-spacing: 0.05em;
        }

        .safety-gauge-status {
          font-size: 0.64rem;
          font-weight: 800;
          font-family: var(--font-mono);
        }

        .corridor-hud-strip {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: #060a14;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.35rem 0.55rem;
          min-width: 0;
        }

        .hud-strip-map {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #080e1a;
          border-radius: 4px;
          padding: 0.2rem 0.35rem;
          border: 1px solid rgba(6, 182, 212, 0.2);
          flex-shrink: 0;
        }

        .hud-corridor-svg {
          width: 72px;
          height: 18px;
        }

        .corridor-status-tag {
          font-size: 0.48rem;
          font-weight: 800;
          color: var(--cyan);
          letter-spacing: 0.05em;
        }

        .corridor-strip-info {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
          flex: 1;
        }

        .corridor-origin {
          font-size: 0.65rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .corridor-dest {
          font-size: 0.68rem;
          font-weight: 600;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .route-metrics-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(95px, 1fr));
          gap: 0.4rem;
          background: #060a14;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.4rem 0.6rem;
          min-width: 0;
        }

        .r-metric {
          display: flex;
          flex-direction: column;
          gap: 0.08rem;
          min-width: 0;
        }

        .r-lbl {
          font-size: 0.55rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          white-space: nowrap;
        }

        .r-val {
          font-size: 0.72rem;
          font-weight: 700;
          color: #ffffff;
          overflow-wrap: break-word;
        }

        .hazards-avoided-box {
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }

        .hazards-title {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.64rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #34d399;
        }

        .hazards-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
        }

        .hazard-avoided-item {
          display: flex;
          align-items: flex-start;
          gap: 0.4rem;
          font-size: 0.68rem;
          color: #cbd5e1;
          line-height: 1.3;
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
          gap: 0.35rem;
          min-width: 0;
        }

        .turn-header {
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--text-dim);
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
          gap: 0.5rem;
          background: #070c17;
          border: 1px solid var(--border-subtle);
          border-radius: 5px;
          padding: 0.32rem 0.55rem;
          min-width: 0;
        }

        .step-num {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(6, 182, 212, 0.2);
          color: var(--cyan);
          font-size: 0.6rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-text {
          flex: 1;
          font-size: 0.7rem;
          color: #f1f5f9;
          min-width: 0;
          overflow-wrap: break-word;
        }

        .step-tag {
          font-size: 0.56rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }

        .tag-safe {
          color: #34d399;
          background: rgba(16, 185, 129, 0.1);
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
        }

        .tag-caution {
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.1);
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
        }

        .start-nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          width: 100%;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0.1) 100%);
          border: 1px solid var(--cyan);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.03em;
          padding: 0.48rem 0.75rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .start-nav-btn:hover {
          background: var(--cyan);
          color: #080c16;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
        }
      `}</style>
    </div>
  );
};
