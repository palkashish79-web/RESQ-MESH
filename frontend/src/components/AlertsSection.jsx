import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { BellIcon, AlertTriangleIcon, CheckIcon, MapPinIcon, ChevronRightIcon, RadioIcon } from './Icons';

export const AlertsSection = ({ limit = 3, showViewAll = true }) => {
  const { currentAlerts, acknowledgedAlerts, acknowledgeAlert, setActiveTab } = useDisaster();

  const displayedAlerts = limit ? currentAlerts.slice(0, limit) : currentAlerts;
  const criticalCount = currentAlerts.filter((a) => a.priority === 'CRITICAL').length;
  const unreadCount = currentAlerts.filter((a) => !acknowledgedAlerts.includes(a.id)).length;

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
            <span>Feed ({currentAlerts.length})</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="card-body">
        {/* Alerts Priority Overview Bar */}
        <div className="alerts-summary-bar">
          <div className="summary-left">
            <span className="summary-pulse-dot"></span>
            <span className="summary-title">LIVE INCIDENT BULLETIN</span>
            <span className="summary-stat">
              <strong>{criticalCount} Critical</strong> • {unreadCount} Unacknowledged
            </span>
          </div>
          <div className="summary-mesh-tag">
            <RadioIcon className="w-3 h-3 text-cyan" />
            <span>P2P RELAY 868MHz</span>
          </div>
        </div>

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
                  <span className="action-label">
                    <AlertTriangleIcon className="w-3 h-3 text-warning" />
                    REQUIRED EVACUATION ACTION:
                  </span>
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

        .alerts-summary-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(245, 158, 11, 0.07);
          border: 1px solid rgba(245, 158, 11, 0.22);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.8rem;
          margin-bottom: 0.85rem;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .summary-left {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          min-width: 0;
          flex-wrap: wrap;
        }

        .summary-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--warning);
          box-shadow: 0 0 6px var(--warning);
        }

        .summary-title {
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #fcd34d;
          text-transform: uppercase;
        }

        .summary-stat {
          font-size: 0.68rem;
          color: var(--text-secondary);
        }

        .summary-stat strong {
          color: #fca5a5;
        }

        .summary-mesh-tag {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.6rem;
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--cyan);
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.25);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          white-space: nowrap;
        }

        .alerts-feed {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          min-width: 0;
        }

        .alert-item {
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-left: 3px solid #94a3b8;
          border-radius: var(--radius-sm);
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          transition: border-color 0.2s ease, transform 0.2s ease;
          min-width: 0;
        }

        .alert-item:hover {
          transform: translateY(-1px);
        }

        .alert-item.priority-critical {
          border-left-color: var(--danger);
          background: radial-gradient(circle at top right, rgba(239, 68, 68, 0.08) 0%, #080d19 70%);
          border-color: rgba(239, 68, 68, 0.22);
        }

        .alert-item.priority-warning {
          border-left-color: var(--warning);
          background: radial-gradient(circle at top right, rgba(245, 158, 11, 0.07) 0%, #080d19 70%);
          border-color: rgba(245, 158, 11, 0.22);
        }

        .alert-item.alert-acknowledged {
          opacity: 0.6;
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
          gap: 0.4rem;
          min-width: 0;
        }

        .alert-type-tag {
          font-size: 0.62rem;
          font-weight: 700;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.12rem 0.45rem;
          border-radius: 4px;
          white-space: nowrap;
        }

        .alert-time {
          font-size: 0.64rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
          white-space: nowrap;
        }

        .ack-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: #cbd5e1;
          font-family: var(--font-main);
          font-size: 0.64rem;
          font-weight: 700;
          padding: 0.22rem 0.55rem;
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
          font-size: 0.82rem;
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
          gap: 0.35rem;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.22);
          border-radius: 4px;
          padding: 0.18rem 0.5rem;
          min-width: 0;
        }

        .alert-pin-icon {
          width: 11px !important;
          height: 11px !important;
          color: var(--cyan) !important;
          flex-shrink: 0;
        }

        .alert-loc-name {
          font-size: 0.68rem;
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
          padding: 0.12rem 0.4rem;
          border-radius: 3px;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .alert-summary {
          font-size: 0.73rem;
          color: #cbd5e1;
          line-height: 1.4;
          overflow-wrap: break-word;
        }

        .alert-action-box {
          background: #050812;
          border: 1px dashed rgba(245, 158, 11, 0.35);
          border-radius: 5px;
          padding: 0.45rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.18rem;
          min-width: 0;
        }

        .action-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #fbbf24;
          white-space: nowrap;
        }

        .action-text {
          font-size: 0.72rem;
          font-weight: 600;
          color: #f1f5f9;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  );
};
export default AlertsSection;
