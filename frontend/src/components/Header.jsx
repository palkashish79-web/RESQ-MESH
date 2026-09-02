import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { ShieldIcon, SirenIcon, RadioIcon, AlertTriangleIcon, MenuIcon, BellIcon } from './Icons';
import { DISASTER_SCENARIOS } from '../data/mockData';

export const Header = ({ onToggleSidebar }) => {
  const {
    scenarioKey,
    switchScenario,
    scenario,
    setSosModalOpen,
    sosActive,
    audioSirenEnabled,
    setAudioSirenEnabled,
    currentAlerts,
    setActiveTab
  } = useDisaster();

  return (
    <header className="header-bar">
      <div className="header-inner">
        <div className="header-left">
          <button className="mobile-menu-btn" onClick={onToggleSidebar} aria-label="Toggle navigation">
            <MenuIcon className="w-5 h-5 text-slate-300" />
          </button>

          <div className="brand-badge" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
            <div className="brand-logo-glow">
              <ShieldIcon className="w-6 h-6 text-cyan" />
            </div>
            <div className="brand-text-block">
              <div className="brand-title">
                RESQ <span>MESH</span>
              </div>
              <div className="brand-sub">AI Emergency & Safety Operations</div>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="scenario-selector-box">
            <span className="selector-label">INCIDENT:</span>
            <select
              value={scenarioKey}
              onChange={(e) => switchScenario(e.target.value)}
              className="scenario-select"
              aria-label="Active emergency incident scenario"
            >
              {Object.entries(DISASTER_SCENARIOS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.title} ({item.severity})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="header-right">
          {/* Mesh Status Pill */}
          <div className="mesh-status-indicator" title="Decentralized emergency mesh network active">
            <span className="mesh-dot blinking"></span>
            <RadioIcon className="w-3.5 h-3.5 text-cyan" />
            <span className="mesh-text">MESH: <strong>48 Nodes</strong></span>
          </div>

          {/* Siren Alert Toggle */}
          <button
            className={`siren-toggle-btn ${audioSirenEnabled ? 'active' : ''}`}
            onClick={() => setAudioSirenEnabled(!audioSirenEnabled)}
            title={audioSirenEnabled ? 'Emergency Siren Alert Active' : 'Enable Siren Broadcasts'}
          >
            <SirenIcon className={`w-4 h-4 ${audioSirenEnabled ? 'text-danger' : 'text-slate-400'}`} />
            <span className="siren-text">{audioSirenEnabled ? 'SIREN ON' : 'SIREN'}</span>
          </button>

          {/* SOS Panic Button */}
          <button
            className={`btn-sos ${sosActive ? 'pulse-beacon' : ''}`}
            onClick={() => setSosModalOpen(true)}
          >
            <AlertTriangleIcon className="w-4 h-4" />
            <span>{sosActive ? 'SOS BROADCASTING' : 'EMERGENCY SOS'}</span>
          </button>
        </div>
      </div>

      <style>{`
        .header-bar {
          background: rgba(11, 17, 32, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 40;
          height: var(--header-height, 54px);
          display: flex;
          align-items: center;
          padding: 0 1.75rem;
          width: 100%;
        }

        .header-inner {
          width: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          min-width: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .mobile-menu-btn {
          display: none;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          padding: 0.35rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .brand-badge {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          user-select: none;
        }

        .brand-logo-glow {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(13, 20, 36, 0.9) 100%);
          border: 1px solid rgba(6, 182, 212, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.3);
          flex-shrink: 0;
        }

        .brand-text-block {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          color: #ffffff;
          line-height: 1.1;
        }

        .brand-title span {
          color: var(--cyan);
        }

        .brand-sub {
          font-size: 0.58rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
        }

        .header-center {
          flex: 1;
          max-width: 380px;
          min-width: 0;
        }

        .scenario-selector-box {
          display: flex;
          align-items: center;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.25rem 0.6rem;
          gap: 0.45rem;
          min-width: 0;
        }

        .selector-label {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--warning);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .scenario-select {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: var(--font-main);
          font-size: 0.76rem;
          font-weight: 600;
          width: 100%;
          outline: none;
          cursor: pointer;
          min-width: 0;
          text-overflow: ellipsis;
        }

        .scenario-select option {
          background: #0d1424;
          color: #ffffff;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }

        .mesh-status-indicator {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.65rem;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.25);
          border-radius: 9999px;
          font-size: 0.68rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .mesh-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 6px var(--cyan);
          flex-shrink: 0;
        }

        .mesh-text strong {
          color: var(--cyan);
        }

        .siren-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.65rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.68rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .siren-toggle-btn.active {
          background: var(--danger-bg);
          border-color: var(--danger-border);
          color: var(--danger);
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }
        }

        @media (max-width: 900px) {
          .mesh-status-indicator {
            display: none;
          }
        }

        @media (max-width: 720px) {
          .header-center {
            display: none;
          }
          .siren-text {
            display: none;
          }
          .header-bar {
            padding: 0 1rem;
          }
          .brand-sub {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
