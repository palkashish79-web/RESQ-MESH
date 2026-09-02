import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { AlertTriangleIcon, ActivityIcon, GaugeIcon, MapPinIcon, UsersIcon } from './Icons';

export const DisasterRiskCard = () => {
  const { scenario } = useDisaster();

  const getScoreColor = (score) => {
    if (score >= 85) return 'var(--danger)';
    if (score >= 70) return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <div className="card-glass accent-danger disaster-risk-card">
      <div className="card-header">
        <div className="card-header-title">
          <div className="header-icon-badge danger">
            <AlertTriangleIcon className="w-4 h-4 text-danger" />
          </div>
          <span>CURRENT DISASTER RISK ASSESSMENT</span>
        </div>
        <div className={`badge ${scenario.severity === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}`}>
          <span className="blinking">●</span> {scenario.severity}
        </div>
      </div>

      <div className="card-body">
        {/* Main Threat Overview Banner */}
        <div className="threat-hero">
          <div className="threat-score-box">
            <div className="gauge-circle" style={{ borderColor: getScoreColor(scenario.riskScore) }}>
              <span className="score-number">{scenario.riskScore}</span>
              <span className="score-max">/100</span>
            </div>
            <div className="threat-score-meta">
              <span className="threat-label">RISK INDEX</span>
              <span className="threat-grade" style={{ color: getScoreColor(scenario.riskScore) }}>
                {scenario.threatLevel}
              </span>
            </div>
          </div>

          <div className="threat-meta-list">
            <div className="meta-item">
              <span className="meta-key">Status</span>
              <span className="meta-val highlight-danger">{scenario.status}</span>
            </div>
            <div className="meta-item">
              <span className="meta-key">Affected Radius</span>
              <span className="meta-val">{scenario.affectedRadius}</span>
            </div>
            <div className="meta-item">
              <span className="meta-key">Primary Impact Zone</span>
              <span className="meta-val">{scenario.impactZone}</span>
            </div>
            <div className="meta-item">
              <span className="meta-key">Population at Risk</span>
              <span className="meta-val text-warning">{scenario.populationAtRisk}</span>
            </div>
          </div>
        </div>

        {/* Urgency Alert Bar */}
        <div className="urgency-banner">
          <div className="urgency-icon">⚠️</div>
          <div className="urgency-content">
            <div className="urgency-title">{scenario.evacuationUrgency}</div>
            <div className="urgency-desc">{scenario.summary}</div>
          </div>
        </div>

        {/* Threat Breakdown Progress Bars */}
        <div className="threat-breakdown">
          <div className="breakdown-header">
            <span>KEY HAZARD VECTORS</span>
            <span>SEVERITY</span>
          </div>

          <div className="breakdown-list">
            {scenario.threatBreakdown.map((item, idx) => (
              <div key={idx} className="breakdown-item">
                <div className="breakdown-top">
                  <span className="breakdown-name">{item.name}</span>
                  <span className="breakdown-score" style={{ color: item.color }}>
                    {item.score}%
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-bar"
                    style={{ width: `${item.score}%`, backgroundColor: item.color }}
                  />
                </div>
                <span className="breakdown-desc">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .disaster-risk-card {
          position: relative;
          min-width: 0;
          width: 100%;
        }

        .threat-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #090f1d;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          margin-bottom: 0.85rem;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .threat-score-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .gauge-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid var(--danger);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(239, 68, 68, 0.08);
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
          flex-shrink: 0;
        }

        .score-number {
          font-size: 1.25rem;
          font-weight: 800;
          font-family: var(--font-mono);
          line-height: 1;
          color: #ffffff;
        }

        .score-max {
          font-size: 0.55rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .threat-score-meta {
          display: flex;
          flex-direction: column;
        }

        .threat-label {
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }

        .threat-grade {
          font-size: 0.92rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .threat-meta-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.55rem 1rem;
          flex: 1;
          min-width: 220px;
          border-left: 1px solid var(--border-subtle);
          padding-left: 1rem;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
        }

        .meta-key {
          font-size: 0.62rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
          white-space: nowrap;
        }

        .meta-val {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
          overflow-wrap: break-word;
        }

        .highlight-danger {
          color: #f87171;
        }

        .text-warning {
          color: #fbbf24;
        }

        .urgency-banner {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          padding: 0.65rem 0.85rem;
          margin-bottom: 0.85rem;
          min-width: 0;
        }

        .urgency-icon {
          font-size: 1.05rem;
          flex-shrink: 0;
        }

        .urgency-content {
          min-width: 0;
          flex: 1;
        }

        .urgency-title {
          font-size: 0.78rem;
          font-weight: 800;
          color: #fca5a5;
          letter-spacing: 0.02em;
          margin-bottom: 0.15rem;
        }

        .urgency-desc {
          font-size: 0.72rem;
          color: #cbd5e1;
          line-height: 1.35;
        }

        .threat-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          min-width: 0;
        }

        .breakdown-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--text-dim);
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.35rem;
        }

        .breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          min-width: 0;
        }

        .breakdown-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }

        .breakdown-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.76rem;
          font-weight: 600;
          gap: 0.5rem;
        }

        .breakdown-name {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .breakdown-score {
          font-family: var(--font-mono);
          font-weight: 700;
          flex-shrink: 0;
          font-size: 0.74rem;
        }

        .progress-track {
          width: 100%;
          height: 5px;
          background: #090e1a;
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.6s ease;
        }

        .breakdown-desc {
          font-size: 0.67rem;
          color: var(--text-muted);
          line-height: 1.3;
        }

        @media (max-width: 1300px) {
          .threat-hero {
            flex-direction: column;
            align-items: flex-start;
          }
          .threat-meta-list {
            grid-template-columns: 1fr 1fr;
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--border-subtle);
            padding-top: 0.65rem;
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .threat-meta-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
