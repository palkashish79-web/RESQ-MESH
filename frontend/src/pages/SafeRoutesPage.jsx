import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { RouteIcon, NavigationIcon, CheckIcon, AlertTriangleIcon, MapPinIcon } from '../components/Icons';

export const SafeRoutesPage = () => {
  const { safeRoutes, shelters } = useDisaster();
  const [selectedRouteId, setSelectedRouteId] = useState(safeRoutes[0]?.id || 'RT-ALPHA');
  const [avoidFloods, setAvoidFloods] = useState(true);
  const [avoidBridges, setAvoidBridges] = useState(true);
  const [vehicleType, setVehicleType] = useState('standard');
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const selectedRoute = safeRoutes.find((r) => r.id === selectedRouteId) || safeRoutes[0];

  const handleStartSimNav = () => {
    setIsNavigating(true);
    setCurrentStepIndex(0);
  };

  const handleNextStep = () => {
    if (currentStepIndex < selectedRoute.turnByTurn.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsNavigating(false);
      setCurrentStepIndex(0);
    }
  };

  return (
    <div className="safe-routes-page">
      {/* Header */}
      <div className="routes-header card-glass">
        <div className="routes-header-info">
          <div className="title-row">
            <RouteIcon className="w-6 h-6 text-cyan" />
            <h2 className="page-heading">AI DYNAMIC EVACUATION ROUTER</h2>
          </div>
          <p className="page-sub">
            Real-time hazard-avoidance routing algorithm utilizing elevation maps, flood sensor telemetry, and live roadblock feeds.
          </p>
        </div>
      </div>

      {/* Main Two Column View */}
      <div className="routes-grid-layout">
        {/* Left: Router Preferences & Options */}
        <div className="router-sidebar-col">
          <div className="card-glass router-config-box">
            <h3 className="config-heading">ROUTING PREFERENCES</h3>

            <div className="config-form">
              <div className="form-item">
                <label className="cfg-label">ORIGIN (YOUR LOCATION)</label>
                <div className="input-loc-locked">
                  <MapPinIcon className="w-4 h-4 text-cyan" />
                  <span>Current GPS: Coastal Sector 4 (Lowland)</span>
                </div>
              </div>

              <div className="form-item">
                <label className="cfg-label">DESTINATION RELIEF SHELTER</label>
                <select
                  className="cfg-select"
                  value={selectedRoute?.destination}
                  onChange={(e) => {
                    const match = safeRoutes.find((r) => r.destination === e.target.value);
                    if (match) setSelectedRouteId(match.id);
                  }}
                >
                  {shelters
                    .filter((s) => !s.status.includes('CLOSED'))
                    .map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.distance})
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-item">
                <label className="cfg-label">TRANSPORT MODE</label>
                <div className="mode-btn-group">
                  <button
                    className={`mode-btn ${vehicleType === 'standard' ? 'active' : ''}`}
                    onClick={() => setVehicleType('standard')}
                  >
                    🚗 Vehicle
                  </button>
                  <button
                    className={`mode-btn ${vehicleType === 'foot' ? 'active' : ''}`}
                    onClick={() => setVehicleType('foot')}
                  >
                    🚶 On Foot
                  </button>
                  <button
                    className={`mode-btn ${vehicleType === 'truck' ? 'active' : ''}`}
                    onClick={() => setVehicleType('truck')}
                  >
                    🚛 High Clearance
                  </button>
                </div>
              </div>

              <div className="form-item">
                <label className="cfg-label">HAZARD AVOIDANCE FILTERS</label>
                <div className="checkbox-list">
                  <label className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={avoidFloods}
                      onChange={(e) => setAvoidFloods(e.target.checked)}
                    />
                    <span>Avoid Submerged Underpasses (&gt;10cm water)</span>
                  </label>
                  <label className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={avoidBridges}
                      onChange={(e) => setAvoidBridges(e.target.checked)}
                    />
                    <span>Avoid Compromised Bridges & Causeways</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Route Comparison List */}
          <div className="card-glass routes-list-box">
            <h3 className="config-heading">CALCULATED CORRIDORS</h3>
            <div className="corridor-cards">
              {safeRoutes.map((r) => (
                <div
                  key={r.id}
                  className={`corridor-card ${r.id === selectedRouteId ? 'active' : ''}`}
                  onClick={() => setSelectedRouteId(r.id)}
                >
                  <div className="corridor-top">
                    <span className="corridor-name">{r.name.split(':')[0]}</span>
                    <span className="corridor-score" style={{ color: r.safetyScore > 85 ? 'var(--success)' : 'var(--warning)' }}>
                      {r.safetyScore}% Safe
                    </span>
                  </div>
                  <div className="corridor-sub">
                    <span>{r.distance} • {r.estimatedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Route HUD & Turn by Turn Navigation */}
        <div className="router-main-col">
          {selectedRoute && (
            <div className="card-glass route-hud-card">
              <div className="hud-header">
                <div>
                  <span className="hud-tag">ACTIVE EVACUATION VECTOR</span>
                  <h3 className="hud-title">{selectedRoute.name}</h3>
                </div>
                <div className="hud-score-chip">
                  <span className="score-big">{selectedRoute.safetyScore}%</span>
                  <span className="score-sub">AI SAFETY SCORE</span>
                </div>
              </div>

              {/* Navigation HUD Simulator Banner */}
              {isNavigating ? (
                <div className="active-nav-banner">
                  <div className="nav-turn-icon">
                    <NavigationIcon className="w-8 h-8 text-cyan" />
                  </div>
                  <div className="nav-turn-info">
                    <span className="nav-step-label">
                      STEP {currentStepIndex + 1} OF {selectedRoute.turnByTurn.length}
                    </span>
                    <h4 className="nav-step-action">
                      {selectedRoute.turnByTurn[currentStepIndex].action}
                    </h4>
                  </div>
                  <button className="btn-next-step" onClick={handleNextStep}>
                    {currentStepIndex === selectedRoute.turnByTurn.length - 1 ? 'ARRIVE' : 'NEXT STEP ▶'}
                  </button>
                </div>
              ) : (
                <div className="nav-idle-banner">
                  <button className="btn-start-nav-large" onClick={handleStartSimNav}>
                    <NavigationIcon className="w-5 h-5" />
                    <span>START TURN-BY-TURN EVACUATION GUIDANCE</span>
                  </button>
                </div>
              )}

              {/* Hazards Avoided Details */}
              <div className="hazards-alert-box">
                <div className="hazards-hdr">
                  <CheckIcon className="w-4 h-4 text-emerald-400" />
                  <span>ACTIVE HAZARDS BYPASSED BY THIS ROUTE</span>
                </div>
                <div className="hazards-chips">
                  {selectedRoute.hazardsAvoided.map((h, idx) => (
                    <div key={idx} className="h-chip">
                      <span>✓ {h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Turn-by-Turn Steps */}
              <div className="full-steps-container">
                <h4 className="steps-title">DETAILED ROUTE WAYPOINTS</h4>
                <div className="steps-list">
                  {selectedRoute.turnByTurn.map((step, idx) => (
                    <div
                      key={step.step}
                      className={`step-row ${isNavigating && idx === currentStepIndex ? 'is-current-nav' : ''}`}
                    >
                      <div className="step-badge">{step.step}</div>
                      <div className="step-desc">{step.action}</div>
                      <div className="step-status">
                        {step.safe ? (
                          <span className="badge-clear">SAFE & ELEVATED</span>
                        ) : (
                          <span className="badge-warn">CAUTION ZONE</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .safe-routes-page {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .routes-header {
          padding: 1.5rem;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .page-heading {
          font-size: 1rem;
          font-weight: 800;
          color: #ffffff;
        }

        .page-sub {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .routes-grid-layout {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 1rem;
          align-items: start;
        }

        .router-sidebar-col {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .router-config-box {
          padding: 0.95rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .config-heading {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--text-dim);
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.4rem;
        }

        .config-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-item {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .cfg-label {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .input-loc-locked {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          padding: 0.45rem 0.65rem;
          border-radius: var(--radius-sm);
          font-size: 0.74rem;
          font-weight: 600;
          color: #cbd5e1;
        }

        .cfg-select {
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.76rem;
          padding: 0.45rem 0.65rem;
          border-radius: var(--radius-sm);
          outline: none;
        }

        .mode-btn-group {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.35rem;
        }

        .mode-btn {
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-family: var(--font-main);
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.4rem 0.2rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .mode-btn.active {
          background: rgba(6, 182, 212, 0.15);
          border-color: var(--cyan);
          color: #ffffff;
        }

        .checkbox-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .filter-checkbox {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.72rem;
          color: #cbd5e1;
          cursor: pointer;
        }

        .filter-checkbox input {
          accent-color: var(--cyan);
        }

        .routes-list-box {
          padding: 0.95rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .corridor-cards {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .corridor-card {
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.6rem 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .corridor-card:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .corridor-card.active {
          background: rgba(6, 182, 212, 0.12);
          border-color: var(--cyan);
        }

        .corridor-top {
          display: flex;
          justify-content: space-between;
          font-size: 0.76rem;
          font-weight: 700;
        }

        .corridor-score {
          font-family: var(--font-mono);
        }

        .corridor-sub {
          font-size: 0.68rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }

        .route-hud-card {
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .hud-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .hud-tag {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--cyan);
          letter-spacing: 0.06em;
        }

        .hud-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
        }

        .hud-score-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-sm);
        }

        .score-big {
          font-size: 1.45rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: #34d399;
          line-height: 1;
        }

        .score-sub {
          font-size: 0.6rem;
          font-weight: 800;
          color: #a7f3d0;
          letter-spacing: 0.05em;
        }

        .active-nav-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.18) 0%, rgba(13, 20, 36, 0.95) 100%);
          border: 1px solid var(--cyan);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.2);
        }

        .nav-turn-info {
          flex: 1;
        }

        .nav-step-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--cyan);
          letter-spacing: 0.05em;
        }

        .nav-step-action {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
          margin-top: 0.2rem;
        }

        .btn-next-step {
          background: var(--cyan);
          border: none;
          color: #080c16;
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 800;
          padding: 0.65rem 1.15rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .btn-start-nav-large {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: 100%;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0.08) 100%);
          border: 1px solid var(--cyan);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.95rem;
          font-weight: 800;
          padding: 0.9rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-start-nav-large:hover {
          background: var(--cyan);
          color: #080c16;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
        }

        .hazards-alert-box {
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: var(--radius-sm);
          padding: 0.85rem 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .hazards-hdr {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.72rem;
          font-weight: 800;
          color: #34d399;
          letter-spacing: 0.05em;
        }

        .hazards-chips {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .h-chip {
          font-size: 0.78rem;
          color: #cbd5e1;
        }

        .full-steps-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .steps-title {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--text-dim);
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .step-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          transition: all 0.2s ease;
        }

        .step-row.is-current-nav {
          background: rgba(6, 182, 212, 0.15);
          border-color: var(--cyan);
        }

        .step-badge {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(6, 182, 212, 0.2);
          color: var(--cyan);
          font-weight: 800;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-desc {
          flex: 1;
          font-size: 0.84rem;
          color: #f1f5f9;
        }

        .badge-clear {
          font-size: 0.68rem;
          font-weight: 800;
          color: #34d399;
          background: rgba(16, 185, 129, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .badge-warn {
          font-size: 0.68rem;
          font-weight: 800;
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        @media (max-width: 960px) {
          .routes-grid-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
