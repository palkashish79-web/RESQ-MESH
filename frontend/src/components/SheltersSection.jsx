import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { ShelterIcon, MapPinIcon, NavigationIcon, PhoneCallIcon, ChevronRightIcon, CheckIcon } from './Icons';

export const SheltersSection = ({ limit = null, showViewAll = true }) => {
  const { shelters, setActiveTab } = useDisaster();
  const [selectedShelterId, setSelectedShelterId] = useState(null);
  const [navigatingShelter, setNavigatingShelter] = useState(null);

  const displayedShelters = limit ? shelters.slice(0, limit) : shelters;

  const handleStartNav = (shelter) => {
    setNavigatingShelter(shelter.id);
    setTimeout(() => {
      setActiveTab('routes');
    }, 400);
  };

  return (
    <div className="card-glass accent-success shelters-section">
      <div className="card-header">
        <div className="card-header-title">
          <div className="header-icon-badge success">
            <ShelterIcon className="w-4 h-4 text-emerald-400" />
          </div>
          <span>OPERATIONAL EMERGENCY SHELTERS</span>
        </div>
        {showViewAll && (
          <button className="view-all-btn" onClick={() => setActiveTab('shelters')}>
            <span>Directory ({shelters.length})</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="card-body">
        <div className="shelters-grid">
          {displayedShelters.map((shelter) => {
            const occupancyPct = Math.round((shelter.capacityOccupied / shelter.capacityTotal) * 100);
            const isClosed = shelter.status.includes('CLOSED');
            return (
              <div key={shelter.id} className={`shelter-card ${isClosed ? 'is-closed' : ''}`}>
                <div className="shelter-top">
                  <div className="shelter-title-block">
                    <span className="shelter-type">{shelter.type}</span>
                    <h4 className="shelter-name">{shelter.name}</h4>
                  </div>
                  <span
                    className="shelter-status-badge"
                    style={{
                      color: shelter.statusColor,
                      backgroundColor: `${shelter.statusColor}18`,
                      borderColor: `${shelter.statusColor}40`
                    }}
                  >
                    {shelter.status}
                  </span>
                </div>

                {/* Location row with clean mini icon pill */}
                <div className="shelter-loc-row">
                  <div className="loc-icon-pill">
                    <MapPinIcon className="w-3.5 h-3.5 text-cyan" />
                  </div>
                  <div className="shelter-loc-details">
                    <div className="loc-pill">
                      <span className="loc-dist">{shelter.distance}</span>
                      <span className="loc-sep">•</span>
                      <span className="loc-elev">Elev: {shelter.elevation}</span>
                    </div>
                    <div className="shelter-address" title={shelter.address}>{shelter.address}</div>
                  </div>
                </div>

                {/* Capacity Circular Progress Meter */}
                {!isClosed && (
                  <div className="shelter-gauge-container">
                    <div className="radial-gauge-wrap">
                      <svg className="radial-gauge-svg" width="38" height="38" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="3.4"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={occupancyPct > 85 ? 'var(--warning)' : 'var(--success)'}
                          strokeWidth="3.4"
                          strokeDasharray={`${occupancyPct}, 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="radial-gauge-label">
                        <span className="gauge-num">{occupancyPct}%</span>
                      </div>
                    </div>

                    <div className="shelter-gauge-info">
                      <div className="gauge-status-line">
                        <span className="gauge-title">OCCUPANCY STATUS</span>
                        <span
                          className="gauge-tag"
                          style={{ color: occupancyPct > 85 ? 'var(--warning)' : 'var(--success)' }}
                        >
                          {occupancyPct > 85 ? 'NEAR CAPACITY' : 'OPERATIONAL'}
                        </span>
                      </div>
                      <div className="gauge-sub-line">
                        <span className="cap-beds-highlight"><strong>{shelter.bedsAvailable}</strong> beds open</span>
                        <span className="gauge-sep">•</span>
                        <span className="cap-total-text">{shelter.capacityOccupied}/{shelter.capacityTotal} occupied</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Amenities Badges */}
                <div className="amenities-wrap">
                  {shelter.amenities.map((amenity, idx) => (
                    <span key={idx} className="amenity-pill">
                      ✓ {amenity}
                    </span>
                  ))}
                </div>

                {/* Actions Bar */}
                <div className="shelter-actions">
                  {!isClosed ? (
                    <button
                      className="btn-navigate"
                      onClick={() => handleStartNav(shelter)}
                    >
                      <NavigationIcon className="w-3.5 h-3.5" />
                      <span>Navigate via Safe Corridor</span>
                    </button>
                  ) : (
                    <div className="closed-warning">DO NOT APPROACH - ZONE FLOODED</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .shelters-section {
          min-width: 0;
          width: 100%;
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: transparent;
          border: none;
          color: var(--cyan);
          font-family: var(--font-main);
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .view-all-btn:hover {
          text-decoration: underline;
        }

        .shelters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 0.75rem;
          min-width: 0;
          width: 100%;
        }

        .shelter-card {
          background: #090f1e;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 0;
          width: 100%;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .shelter-card:hover {
          border-color: rgba(16, 185, 129, 0.35);
          transform: translateY(-2px);
        }

        .shelter-card.is-closed {
          opacity: 0.6;
          border-color: rgba(239, 68, 68, 0.2);
        }

        .shelter-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 0.4rem;
          min-width: 0;
        }

        .shelter-title-block {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .shelter-type {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--cyan);
          display: block;
        }

        .shelter-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
          margin-top: 0.1rem;
          line-height: 1.25;
          overflow-wrap: break-word;
        }

        .shelter-status-badge {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 0.15rem 0.45rem;
          border-radius: 9999px;
          border: 1px solid;
          line-height: 1.2;
          max-width: 100%;
          text-align: center;
          flex-shrink: 0;
        }

        .shelter-loc-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #060a14;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.4rem 0.6rem;
          min-width: 0;
        }

        .loc-icon-pill {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .shelter-loc-details {
          display: flex;
          flex-direction: column;
          gap: 0.12rem;
          min-width: 0;
          flex: 1;
        }

        .loc-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.68rem;
          font-weight: 600;
          color: #94a3b8;
          min-width: 0;
          flex-wrap: wrap;
        }

        .loc-dist {
          color: #f1f5f9;
          font-weight: 700;
        }

        .loc-sep {
          color: var(--text-dim);
        }

        .loc-elev {
          color: #38bdf8;
          font-family: var(--font-mono);
          font-size: 0.64rem;
        }

        .shelter-address {
          font-size: 0.65rem;
          color: var(--text-muted);
          overflow-wrap: break-word;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .shelter-gauge-container {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: #060a14;
          padding: 0.4rem 0.6rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          min-width: 0;
        }

        .gauge-num {
          font-size: 0.58rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: #ffffff;
        }

        .shelter-gauge-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
          flex: 1;
        }

        .gauge-status-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .gauge-title {
          color: var(--text-dim);
        }

        .gauge-tag {
          font-family: var(--font-mono);
        }

        .gauge-sub-line {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.65rem;
          color: var(--text-secondary);
        }

        .cap-beds-highlight strong {
          color: var(--success);
          font-family: var(--font-mono);
        }

        .gauge-sep {
          color: var(--text-dim);
        }

        .cap-total-text {
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 0.62rem;
        }

        .amenities-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          min-width: 0;
        }

        .amenity-pill {
          font-size: 0.58rem;
          font-weight: 600;
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.12rem 0.35rem;
          border-radius: 4px;
          line-height: 1.25;
        }

        .shelter-actions {
          margin-top: auto;
          padding-top: 0.25rem;
          min-width: 0;
        }

        .btn-navigate {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          width: 100%;
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.4);
          color: var(--cyan);
          font-family: var(--font-main);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.4rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .btn-navigate:hover {
          background: var(--cyan);
          color: #080c16;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.35);
        }

        .closed-warning {
          text-align: center;
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--danger);
          padding: 0.35rem;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 4px;
        }

        .amenities-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          min-width: 0;
        }

        .amenity-pill {
          font-size: 0.58rem;
          font-weight: 600;
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.12rem 0.35rem;
          border-radius: 4px;
          line-height: 1.25;
        }

        .shelter-actions {
          margin-top: auto;
          padding-top: 0.25rem;
          min-width: 0;
        }

        .btn-navigate {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          width: 100%;
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.4);
          color: var(--cyan);
          font-family: var(--font-main);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.4rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .btn-navigate:hover {
          background: var(--cyan);
          color: #080c16;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.35);
        }

        .closed-warning {
          text-align: center;
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--danger);
          padding: 0.35rem;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};
