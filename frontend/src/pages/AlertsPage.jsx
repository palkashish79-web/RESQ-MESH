import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { BellIcon, SearchIcon, CheckIcon, MapPinIcon, AlertTriangleIcon } from '../components/Icons';

export const AlertsPage = () => {
  const { currentAlerts, acknowledgedAlerts, acknowledgeAlert } = useDisaster();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  const categories = ['ALL', 'Evacuation', 'Road Hazard', 'Infrastructure', 'Relief & Supplies'];

  const filteredAlerts = currentAlerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      selectedPriority === 'ALL' || alert.priority === selectedPriority;

    const matchesType = selectedType === 'ALL' || alert.type === selectedType;

    return matchesSearch && matchesPriority && matchesType;
  });

  const handleAcknowledgeAll = () => {
    filteredAlerts.forEach((a) => acknowledgeAlert(a.id));
  };

  return (
    <div className="alerts-page">
      {/* Header Bar */}
      <div className="alerts-header-card card-glass">
        <div className="header-info">
          <div className="title-row">
            <BellIcon className="w-6 h-6 text-danger" />
            <h2 className="page-heading">EMERGENCY BROADCAST ALERTS FEED</h2>
          </div>
          <p className="page-sub">
            Real-time critical bulletins transmitted via government emergency management & ResQ Mesh mesh relays.
          </p>
        </div>

        <button className="btn-ack-all" onClick={handleAcknowledgeAll}>
          <CheckIcon className="w-4 h-4" />
          <span>Acknowledge Filtered ({filteredAlerts.length})</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar card-glass">
        <div className="search-box">
          <SearchIcon className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            className="search-input"
            placeholder="Search alerts by location, keyword, or advisory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <span className="filter-lbl">PRIORITY:</span>
          {['ALL', 'CRITICAL', 'WARNING', 'ADVISORY'].map((p) => (
            <button
              key={p}
              className={`pill-btn ${selectedPriority === p ? 'active' : ''}`}
              onClick={() => setSelectedPriority(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="filter-pills">
          <span className="filter-lbl">TYPE:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${selectedType === cat ? 'active' : ''}`}
              onClick={() => setSelectedType(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="empty-alerts card-glass">
            <span>No emergency alerts match your selected filters.</span>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isAck = acknowledgedAlerts.includes(alert.id);
            return (
              <div
                key={alert.id}
                className={`full-alert-card card-glass ${
                  alert.priority === 'CRITICAL' ? 'border-critical' : 'border-warning'
                } ${isAck ? 'is-acked-card' : ''}`}
              >
                <div className="alert-card-top">
                  <div className="top-meta">
                    <span
                      className={`badge ${
                        alert.priority === 'CRITICAL' ? 'badge-critical' : 'badge-warning'
                      }`}
                    >
                      {alert.priority}
                    </span>
                    <span className="type-badge">{alert.type}</span>
                    <span className="time-badge">{alert.timestamp}</span>
                    <span className="source-badge">Source: {alert.source}</span>
                  </div>

                  <button
                    className={`ack-btn-lg ${isAck ? 'acked' : ''}`}
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>{isAck ? 'Acknowledged' : 'Mark as Read'}</span>
                  </button>
                </div>

                <h3 className="alert-card-title">{alert.title}</h3>

                <div className="alert-card-loc">
                  <MapPinIcon className="w-4 h-4 text-cyan" />
                  <span>Target Area: <strong>{alert.location}</strong></span>
                </div>

                <p className="alert-card-summary">{alert.summary}</p>

                <div className="action-instruction-card">
                  <div className="action-tag">MANDATORY PROTOCOL</div>
                  <div className="action-message">{alert.actionRequired}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .alerts-page {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .alerts-header-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
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

        .btn-ack-all {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.6rem 1rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .btn-ack-all:hover {
          background: rgba(16, 185, 129, 0.25);
        }

        .filter-bar {
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.55rem 0.85rem;
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
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .filter-lbl {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-dim);
          margin-right: 0.25rem;
        }

        .pill-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-family: var(--font-main);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
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

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .full-alert-card {
          padding: 1rem 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          border-left: 4px solid;
        }

        .border-critical {
          border-left-color: var(--danger);
        }

        .border-warning {
          border-left-color: var(--warning);
        }

        .is-acked-card {
          opacity: 0.65;
        }

        .alert-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .top-meta {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .type-badge {
          font-size: 0.65rem;
          background: rgba(255, 255, 255, 0.06);
          padding: 0.12rem 0.45rem;
          border-radius: 4px;
          color: var(--text-secondary);
        }

        .time-badge {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .source-badge {
          font-size: 0.65rem;
          color: var(--text-dim);
        }

        .ack-btn-lg {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-family: var(--font-main);
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .ack-btn-lg.acked {
          background: var(--success-bg);
          border-color: var(--success-border);
          color: #34d399;
        }

        .alert-card-title {
          font-size: 0.88rem;
          font-weight: 800;
          color: #ffffff;
        }

        .alert-card-loc {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.74rem;
          color: var(--text-secondary);
        }

        .alert-card-loc strong {
          color: #ffffff;
        }

        .alert-card-summary {
          font-size: 0.76rem;
          color: #cbd5e1;
          line-height: 1.4;
        }

        .action-instruction-card {
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.85rem;
        }

        .action-tag {
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--cyan);
          margin-bottom: 0.15rem;
        }

        .action-message {
          font-size: 0.76rem;
          font-weight: 600;
          color: #f8fafc;
        }

        .empty-alerts {
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
