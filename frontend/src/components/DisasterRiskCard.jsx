import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { AlertTriangleIcon, ActivityIcon, GaugeIcon, MapPinIcon, UsersIcon, ShieldIcon } from './Icons';
import { SemiCircularGauge } from './Gauges';

export const DisasterRiskCard = () => {
  const { scenario } = useDisaster();

  const getScoreColor = (score) => {
    if (score >= 85) return '#ef4444';
    if (score >= 70) return '#f59e0b';
    return '#10b981';
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
        {/* Main Threat Overview Banner with SemiCircular Speedometer Gauge */}
        <div className="threat-hero">
          <div className="threat-gauge-wrapper">
            <SemiCircularGauge
              value={scenario.riskScore}
              max={100}
              severity={scenario.threatLevel}
              width={140}
              height={76}
              color={getScoreColor(scenario.riskScore)}
            />
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

        {/* Urgency Alert Bar with scanning icon */}
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
            <div className="breakdown-header-title">
              <ActivityIcon className="w-3.5 h-3.5 text-danger" />
              <span>KEY HAZARD VECTORS</span>
            </div>
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
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}60`
                    }}
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
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.95rem 1.15rem;
          margin-bottom: 0.85rem;
          gap: 1.15rem;
          flex-wrap: wrap;
        }

        .threat-gauge-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.2rem 0.5rem;
          flex-shrink: 0;
        }

        .threat-meta-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.65rem 1rem;
          flex: 1;
          min-width: 220px;
          border-left: 1px solid var(--border-subtle);
          padding-left: 1.15rem;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.12rem;
          min-width: 0;
        }

        .meta-key {
          font-size: 0.62rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          white-space: nowrap;
        }

        .meta-val {
          font-size: 0.82rem;
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
          gap: 0.75rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          padding: 0.75rem 0.95rem;
          margin-bottom: 0.85rem;
          min-width: 0;
        }

        .urgency-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .urgency-content {
          min-width: 0;
          flex: 1;
        }

        .urgency-title {
          font-size: 0.8rem;
          font-weight: 800;
          color: #fca5a5;
          letter-spacing: 0.02em;
          margin-bottom: 0.2rem;
        }

        .urgency-desc {
          font-size: 0.73rem;
          color: #cbd5e1;
          line-height: 1.4;
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
          align-items: center;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--text-dim);
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.35rem;
        }

        .breakdown-header-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #f87171;
        }

        .breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
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
          color: #e2e8f0;
        }

        .breakdown-score {
          font-family: var(--font-mono);
          font-weight: 800;
          flex-shrink: 0;
          font-size: 0.75rem;
        }

        .progress-track {
          width: 100%;
          height: 6px;
          background: #050812;
          border-radius: 9999px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.04);
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
            padding-top: 0.75rem;
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
export default DisasterRiskCard;
