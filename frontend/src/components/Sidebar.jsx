import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import {
  LayoutDashboardIcon,
  MapIcon,
  BellIcon,
  ShelterIcon,
  RouteIcon,
  AlertTriangleIcon,
  BotIcon,
  RadioIcon,
  ActivityIcon,
  XIcon
} from './Icons';

export const Sidebar = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentAlerts, acknowledgedAlerts, setSosModalOpen, sosActive } = useDisaster();

  const unreadAlerts = currentAlerts.filter((a) => !acknowledgedAlerts.includes(a.id)).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon, badge: null },
    { id: 'map', label: 'Risk Map', icon: MapIcon, badge: 'LIVE' },
    { id: 'alerts', label: 'Alerts', icon: BellIcon, badge: unreadAlerts > 0 ? `${unreadAlerts} New` : null, badgeColor: 'danger' },
    { id: 'shelters', label: 'Shelters', icon: ShelterIcon, badge: '4 Open' },
    { id: 'routes', label: 'Safe Routes', icon: RouteIcon, badge: 'AI Safe' },
    { id: 'sos', label: 'Emergency SOS', icon: AlertTriangleIcon, badge: sosActive ? 'ACTIVE' : null, isSos: true }
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar-container ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header-mobile">
          <span className="sidebar-title">OPERATIONS MENU</span>
          <button className="close-btn" onClick={onClose}>
            <XIcon className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="nav-section-label">MAIN COMMAND</div>
        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? 'active' : ''} ${item.isSos ? 'nav-link-sos' : ''}`}
                onClick={() => handleSelectTab(item.id)}
              >
                <div className="nav-link-left">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan' : item.isSos ? 'text-danger' : 'text-slate-400'}`} />
                  <span className="nav-link-text">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`nav-badge ${
                      item.badgeColor === 'danger' || item.isSos ? 'badge-danger-fill' : 'badge-subtle'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Live Network Telemetry Widget */}
        <div className="telemetry-widget">
          <div className="telemetry-header">
            <RadioIcon className="w-4 h-4 text-cyan" />
            <span>RESQ MESH TELEMETRY</span>
          </div>
          <div className="telemetry-rows">
            <div className="telemetry-row">
              <span className="telemetry-key">Relay Frequency</span>
              <span className="telemetry-val">868.4 MHz LoRa</span>
            </div>
            <div className="telemetry-row">
              <span className="telemetry-key">Mesh Nodes</span>
              <span className="telemetry-val text-cyan">48 Active</span>
            </div>
            <div className="telemetry-row">
              <span className="telemetry-key">P2P Health</span>
              <span className="telemetry-val text-emerald">99.8% Sync</span>
            </div>
          </div>
        </div>

        {/* Quick SOS Trigger in sidebar bottom */}
        <div className="sidebar-footer">
          <button
            className="sidebar-sos-trigger"
            onClick={() => setSosModalOpen(true)}
          >
            <AlertTriangleIcon className="w-4 h-4" />
            <span>TRIGGER DISTRESS SOS</span>
          </button>
        </div>
      </aside>

      <style>{`
        .sidebar-container {
          width: 240px;
          min-width: 240px;
          background: #0b1120;
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          padding: 0.85rem 0.65rem;
          height: calc(100vh - var(--header-height, 54px) - var(--ticker-height, 34px));
          position: sticky;
          top: calc(var(--header-height, 54px) + var(--ticker-height, 34px));
          z-index: 35;
          flex-shrink: 0;
          transition: transform 0.3s ease;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-header-mobile {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 0.5rem 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 0.5rem;
        }

        .sidebar-title {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .nav-section-label {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-dim);
          padding: 0.3rem 0.65rem 0.25rem;
        }

        .nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.5rem 0.65rem;
          border-radius: var(--radius-md);
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          font-family: var(--font-main);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link-left {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 0;
        }

        .nav-link-text {
          font-size: 0.82rem;
          font-weight: 600;
          white-space: nowrap;
          color: inherit;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
        }

        .nav-link.active {
          background: rgba(6, 182, 212, 0.12);
          border-color: rgba(6, 182, 212, 0.35);
          color: #ffffff;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.15);
        }

        .nav-link-sos {
          margin-top: 0.35rem;
          background: rgba(239, 68, 68, 0.06);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        .nav-link-sos:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #ffffff;
        }

        .nav-link-sos.active {
          background: rgba(239, 68, 68, 0.2);
          border-color: var(--danger);
          color: #ffffff;
        }

        .nav-badge {
          font-size: 0.6rem;
          font-weight: 800;
          padding: 0.12rem 0.4rem;
          border-radius: 9999px;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .badge-subtle {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
        }

        .badge-danger-fill {
          background: var(--danger);
          color: #ffffff;
        }

        .telemetry-widget {
          margin-top: auto;
          background: #070c18;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.75rem;
          margin-bottom: 0.75rem;
        }

        .telemetry-header {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--cyan);
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.35rem;
          margin-bottom: 0.45rem;
        }

        .telemetry-rows {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .telemetry-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
        }

        .telemetry-key {
          color: var(--text-dim);
        }

        .telemetry-val {
          font-weight: 700;
          color: #ffffff;
          font-family: var(--font-mono);
        }

        .text-cyan { color: var(--cyan); }
        .text-emerald { color: #34d399; }

        .sidebar-footer {
          padding-top: 0.25rem;
          border-top: 1px solid var(--border-subtle);
        }

        .sidebar-sos-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          width: 100%;
          padding: 0.55rem 0.5rem;
          background: rgba(239, 68, 68, 0.12);
          border: 1px dashed rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          font-family: var(--font-main);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-sos-trigger:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #ffffff;
          border-color: var(--danger);
        }

        .sidebar-backdrop {
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(4px);
            z-index: 58;
          }

          .sidebar-container {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 60;
            transform: translateX(-100%);
            box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
          }

          .sidebar-container.mobile-open {
            transform: translateX(0);
          }

          .sidebar-header-mobile {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};
