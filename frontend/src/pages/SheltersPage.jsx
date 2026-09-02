import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { SheltersSection } from '../components/SheltersSection';
import { ShelterIcon, SearchIcon, NavigationIcon, PhoneCallIcon, MapPinIcon, CheckIcon } from '../components/Icons';

export const SheltersPage = () => {
  const { shelters, setActiveTab } = useDisaster();
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredShelters = shelters.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.amenities.some((a) => a.toLowerCase().includes(filterQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'OPEN' && !s.status.includes('CLOSED')) ||
      (statusFilter === 'AVAILABLE_BEDS' && s.bedsAvailable > 0);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="shelters-page">
      {/* Header Banner */}
      <div className="shelters-header card-glass">
        <div className="header-info">
          <div className="title-row">
            <ShelterIcon className="w-6 h-6 text-emerald-400" />
            <h2 className="page-heading">HIGH-GROUND RELIEF SHELTERS DIRECTORY</h2>
          </div>
          <p className="page-sub">
            Verified emergency reception centers with live bed capacity, medical supplies, backup generators, and clean water.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="shelters-filter-bar card-glass">
        <div className="search-box">
          <SearchIcon className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by shelter name, address, or amenities (e.g. 'generator', 'pet', 'medical')..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button
            className={`pill-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All Shelters ({shelters.length})
          </button>
          <button
            className={`pill-btn ${statusFilter === 'OPEN' ? 'active' : ''}`}
            onClick={() => setStatusFilter('OPEN')}
          >
            Open & Accepting
          </button>
          <button
            className={`pill-btn ${statusFilter === 'AVAILABLE_BEDS' ? 'active' : ''}`}
            onClick={() => setStatusFilter('AVAILABLE_BEDS')}
          >
            Has Open Beds
          </button>
        </div>
      </div>

      {/* Shelter Grid View */}
      <div className="shelters-full-grid">
        {filteredShelters.map((shelter) => {
          const occupancyPct = Math.round((shelter.capacityOccupied / shelter.capacityTotal) * 100);
          const isClosed = shelter.status.includes('CLOSED');

          return (
            <div key={shelter.id} className={`shelter-detail-card card-glass ${isClosed ? 'is-closed' : ''}`}>
              <div className="card-top">
                <div>
                  <span className="shelter-category">{shelter.type}</span>
                  <h3 className="shelter-title">{shelter.name}</h3>
                </div>
                <span
                  className="status-pill"
                  style={{
                    color: shelter.statusColor,
                    backgroundColor: `${shelter.statusColor}18`,
                    borderColor: `${shelter.statusColor}40`
                  }}
                >
                  {shelter.status}
                </span>
              </div>

              <div className="shelter-loc-row">
                <MapPinIcon className="w-4 h-4 text-slate-400" />
                <span>{shelter.address} • <strong>{shelter.distance}</strong></span>
              </div>

              {/* Elevation & Doctor badges */}
              <div className="badge-row">
                <span className="info-chip">⛰️ Elevation: {shelter.elevation}</span>
                <span className="info-chip">📦 Supplies: {shelter.suppliesStatus}</span>
                {shelter.doctorOnSite && <span className="info-chip text-emerald">🩺 Medical Doctor On Site</span>}
              </div>

              {/* Capacity Meter */}
              {!isClosed ? (
                <div className="cap-box">
                  <div className="cap-labels">
                    <span>CAPACITY OCCUPIED: <strong>{occupancyPct}%</strong> ({shelter.capacityOccupied}/{shelter.capacityTotal})</span>
                    <span className="beds-open"><strong>{shelter.bedsAvailable}</strong> BEDS OPEN</span>
                  </div>
                  <div className="cap-track">
                    <div
                      className="cap-fill"
                      style={{
                        width: `${occupancyPct}%`,
                        backgroundColor: occupancyPct > 85 ? 'var(--warning)' : 'var(--success)'
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="danger-strip">
                  ⚠️ INUNDATED BY STORM SURGE. ALL EVACUEES REROUTED TO CIVIC CENTER.
                </div>
              )}

              {/* Amenities Grid */}
              <div className="amenities-container">
                <span className="amenities-title">AVAILABLE SERVICES:</span>
                <div className="amenity-tags">
                  {shelter.amenities.map((amenity, idx) => (
                    <span key={idx} className="tag-chip">✓ {amenity}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="actions-footer">
                {!isClosed && (
                  <button className="nav-action-btn" onClick={() => setActiveTab('routes')}>
                    <NavigationIcon className="w-4 h-4" />
                    <span>Get AI Safe Route Directions</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .shelters-page {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .shelters-header {
          padding: 1.5rem;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .page-heading {
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
        }

        .page-sub {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-top: 0.35rem;
        }

        .shelters-filter-bar {
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.55rem 0.85rem;
          flex: 1;
          min-width: 280px;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.85rem;
          outline: none;
        }

        .filter-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .pill-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-family: var(--font-main);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pill-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .pill-btn.active {
          background: rgba(6, 182, 212, 0.15);
          border-color: var(--cyan);
          color: #ffffff;
        }

        .shelters-full-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 0.85rem;
        }

        .shelter-detail-card {
          padding: 1rem 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .shelter-detail-card.is-closed {
          opacity: 0.55;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .shelter-category {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--cyan);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .shelter-title {
          font-size: 0.88rem;
          font-weight: 800;
          color: #ffffff;
          margin-top: 0.1rem;
        }

        .status-pill {
          font-size: 0.62rem;
          font-weight: 800;
          padding: 0.18rem 0.5rem;
          border-radius: 9999px;
          border: 1px solid;
          white-space: nowrap;
        }

        .shelter-loc-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.74rem;
          color: var(--text-secondary);
        }

        .shelter-loc-row strong {
          color: #ffffff;
        }

        .badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .info-chip {
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          color: #cbd5e1;
        }

        .info-chip.text-emerald {
          color: #34d399;
          border-color: rgba(16, 185, 129, 0.3);
        }

        .cap-box {
          background: #070c17;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .cap-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .cap-labels strong {
          color: #ffffff;
        }

        .beds-open strong {
          color: var(--success);
          font-family: var(--font-mono);
        }

        .cap-track {
          width: 100%;
          height: 7px;
          background: #1e293b;
          border-radius: 9999px;
          overflow: hidden;
        }

        .cap-fill {
          height: 100%;
          border-radius: 9999px;
        }

        .danger-strip {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #fca5a5;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-sm);
        }

        .amenities-container {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .amenities-title {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-dim);
          letter-spacing: 0.05em;
        }

        .amenity-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .tag-chip {
          background: rgba(255, 255, 255, 0.04);
          font-size: 0.7rem;
          color: #cbd5e1;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .actions-footer {
          margin-top: auto;
        }

        .nav-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          background: var(--cyan);
          border: none;
          color: #080c16;
          font-family: var(--font-main);
          font-size: 0.85rem;
          font-weight: 800;
          padding: 0.7rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-action-btn:hover {
          box-shadow: 0 0 15px var(--cyan);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};
