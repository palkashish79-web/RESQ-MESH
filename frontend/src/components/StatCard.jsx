import React from 'react';
import { CircularGauge } from './Gauges';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  color = 'cyan',
  gaugeValue = null
}) => {
  const colorMap = {
    cyan: {
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.35)',
      text: 'var(--cyan)',
      glow: 'rgba(6, 182, 212, 0.15)'
    },
    danger: {
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.35)',
      text: 'var(--danger)',
      glow: 'rgba(239, 68, 68, 0.15)'
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.35)',
      text: 'var(--warning)',
      glow: 'rgba(245, 158, 11, 0.15)'
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.35)',
      text: 'var(--success)',
      glow: 'rgba(16, 185, 129, 0.15)'
    },
    purple: {
      bg: 'rgba(139, 92, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.35)',
      text: 'var(--purple)',
      glow: 'rgba(139, 92, 246, 0.15)'
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div
      className="stat-card"
      style={{
        borderTop: `2px solid ${scheme.text}`,
        background: `radial-gradient(circle at 85% 0%, ${scheme.bg} 0%, rgba(13, 20, 36, 0.98) 70%), #0d1424`,
        boxShadow: `0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
      }}
    >
      <div className="stat-top">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div
            className="stat-icon-wrapper"
            style={{
              background: scheme.bg,
              borderColor: scheme.border,
              color: scheme.text
            }}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="stat-middle">
        <span className="stat-value">{value}</span>
        {gaugeValue !== null && (
          <div className="stat-gauge-wrap">
            <CircularGauge
              value={gaugeValue}
              size={36}
              strokeWidth={3.8}
              color={scheme.text}
              label={`${gaugeValue}%`}
            />
          </div>
        )}
      </div>

      <div className="stat-bottom">
        {trend && (
          <span
            className="stat-trend"
            style={{
              color: scheme.text,
              backgroundColor: scheme.bg,
              border: `1px solid ${scheme.border}`
            }}
          >
            {trend}
          </span>
        )}
        <span className="stat-subtext">{subtext}</span>
      </div>

      <style>{`
        .stat-card {
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          min-width: 0;
          width: 100%;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 25px -4px rgba(0, 0, 0, 0.65);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .stat-title {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-icon-wrapper {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-middle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.4rem;
          min-width: 0;
          margin-top: 0.1rem;
        }

        .stat-value {
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          font-family: var(--font-mono);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.15;
        }

        .stat-gauge-wrap {
          flex-shrink: 0;
        }

        .stat-bottom {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.4rem;
          font-size: 0.68rem;
          min-width: 0;
          margin-top: 0.1rem;
        }

        .stat-trend {
          font-weight: 800;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          padding: 0.12rem 0.4rem;
          border-radius: 4px;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }

        .stat-subtext {
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.68rem;
        }
      `}</style>
    </div>
  );
};
export default StatCard;
