import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, trend, color = 'cyan' }) => {
  const colorMap = {
    cyan: { bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.3)', text: 'var(--cyan)' },
    danger: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: 'var(--danger)' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: 'var(--warning)' },
    success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: 'var(--success)' },
    purple: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)', text: 'var(--purple)' }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div
      className="stat-card"
      style={{
        borderTop: `2px solid ${scheme.text}`,
        background: `linear-gradient(180deg, ${scheme.bg} 0%, rgba(13, 21, 39, 0.98) 100%)`
      }}
    >
      <div className="stat-top">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div className="stat-icon-wrapper" style={{ background: scheme.bg, borderColor: scheme.border, color: scheme.text }}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="stat-middle">
        <span className="stat-value">{value}</span>
      </div>

      <div className="stat-bottom">
        {trend && (
          <span className="stat-trend" style={{ color: scheme.text }}>
            {trend}
          </span>
        )}
        <span className="stat-subtext">{subtext}</span>
      </div>

      <style>{`
        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.75rem 0.95rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          min-width: 0;
          width: 100%;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .stat-title {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
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
          align-items: baseline;
          gap: 0.4rem;
          min-width: 0;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          font-family: var(--font-mono);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.15;
        }

        .stat-bottom {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.4rem;
          font-size: 0.68rem;
          min-width: 0;
        }

        .stat-trend {
          font-weight: 700;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          white-space: nowrap;
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
