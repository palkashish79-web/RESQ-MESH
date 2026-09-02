import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { BellIcon, AlertTriangleIcon, CheckIcon, MapPinIcon, ChevronRightIcon } from './Icons';

export const AlertsSection = ({ limit = 3, showViewAll = true }) => {
  const { currentAlerts, acknowledgedAlerts, acknowledgeAlert, setActiveTab } = useDisaster();

  const displayedAlerts = limit ? currentAlerts.slice(0, limit) : currentAlerts;

  return (
    <div className="card-glass accent-warning alerts-section">
      <div className="card-header">
        <div className="card-header-title">
          <div className="header-icon-badge warning">
            <BellIcon className="w-4 h-4 text-warning" />
          </div>
          <span>EMERGENCY BROADCAST ALERTS</span>
        </div>
        {showViewAll && (
          <button className="view-all-btn" onClick={() => setActiveTab('alerts')}>
            <span>View All ({currentAlerts.length})</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="card-body">
        <div className="alerts-feed">
          {displayedAlerts.map((alert) => {
            const isAck = acknowledgedAlerts.includes(alert.id);
            return (
              <div
                key={alert.id}
                className={`alert-item ${alert.priority === 'CRITICAL' ? 'priority-critical' : 'priority-warning'} ${
                  isAck ? 'alert-acknowledged' : ''
                }`}
              >
                <div className="alert-top">
                  <div className="alert-meta-left">
                    <span
                      className={`badge ${
                        alert.priority === 'CRITICAL' ? 'badge-critical' : 'badge-warning'
                      }`}
                    >
                      {alert.priority}
                    </span>
                    <span className="alert-type-tag">{alert.type}</span>
                    <span className="alert-time">{alert.timestamp}</span>
                  </div>

                  <button
                    className={`ack-btn ${isAck ? 'is-acked' : ''}`}
                    onClick={() => acknowledgeAlert(alert.id)}
                    title={isAck ? 'Alert Acknowledged' : 'Acknowledge this alert'}
                  >
                    <CheckIcon className="w-3 h-3" />
                    <span>{isAck ? 'Acknowledged' : 'Acknowledge'}</span>
                  </button>
                </div>

                <h4 className="alert-title">{alert.title}</h4>

                <div className="alert-location-row">
                  <div className="alert-location-pill">
                    <MapPinIcon className="alert-pin-icon" />
                    <span className="alert-loc-name">{alert.location}</span>
                  </div>
                  <span className="alert-sector-tag">ZONE ACTIVE</span>
                </div>

                <p className="alert-summary">{alert.summary}</p>

                <div className="alert-action-box">
                  <span className="action-label">REQUIRED ACTION:</span>
                  <span className="action-text">{alert.actionRequired}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .alerts-section {
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

        .alerts-feed {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          min-width: 0;
        }

        .alert-item {
          background: #090f1e;
          border: 1px solid var(--border-subtle);
          border-left: 3px solid #94a3b8;
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.38rem;
          transition: border-color 0.2s ease;
          min-width: 0;
        }

        .alert-item.priority-critical {
          border-left-color: var(--danger);
          background: linear-gradient(90deg, rgba(239, 68, 68, 0.06) 0%, #090f1e 100%);
        }

        .alert-item.priority-warning {
          border-left-color: var(--warning);
          background: linear-gradient(90deg, rgba(245, 158, 11, 0.05) 0%, #090f1e 100%);
        }

        .alert-item.alert-acknowledged {
          opacity: 0.65;
          border-left-color: var(--text-dim);
        }

        .alert-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.4rem;
          min-width: 0;
        }

        .alert-meta-left {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.35rem;
          min-width: 0;
        }

        .alert-type-tag {
          font-size: 0.62rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          white-space: nowrap;
        }

        .alert-time {
          font-size: 0.62rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .ack-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-family: var(--font-main);
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.18rem 0.45rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .ack-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .ack-btn.is-acked {
          background: var(--success-bg);
          border-color: var(--success-border);
          color: #34d399;
        }

        .alert-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.25;
          overflow-wrap: break-word;
        }

        .alert-location-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          min-width: 0;
          flex-wrap: wrap;
        }

        .alert-location-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.22);
          border-radius: 4px;
          padding: 0.15rem 0.45rem;
          min-width: 0;
        }

        .alert-pin-icon {
          width: 11px !important;
          height: 11px !important;
          color: var(--cyan) !important;
          flex-shrink: 0;
        }

        .alert-loc-name {
          font-size: 0.66rem;
          font-weight: 600;
          color: #cbd5e1;
          overflow-wrap: break-word;
        }

        .alert-sector-tag {
          font-size: 0.55rem;
          font-weight: 800;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          padding: 0.1rem 0.35rem;
          border-radius: 3px;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .alert-summary {
          font-size: 0.72rem;
          color: #cbd5e1;
          line-height: 1.35;
          overflow-wrap: break-word;
        }

        .alert-action-box {
          background: #060a14;
          border: 1px dashed var(--border-subtle);
          border-radius: 5px;
          padding: 0.38rem 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.12rem;
          min-width: 0;
        }

        .action-label {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--cyan);
          white-space: nowrap;
        }

        .action-text {
          font-size: 0.7rem;
          font-weight: 600;
          color: #f1f5f9;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  );
};
