import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { AlertTriangleIcon, RadioIcon, MapPinIcon, PhoneCallIcon, ShieldIcon, CheckIcon } from '../components/Icons';

export const SosPage = () => {
  const { setSosModalOpen, sosActive, sosPayload, cancelSos, scenario } = useDisaster();

  const emergencyContacts = [
    { agency: 'National Disaster Response Force (NDRF)', number: '1078 / 112', type: 'Primary Rescue Command' },
    { agency: 'Coast Guard & Maritime Water Rescue', number: '1554', type: 'Flood & Inundation Extraction' },
    { agency: 'State Emergency Operations Center', number: '1070', type: 'Helicopter & Triage Dispatch' },
    { agency: 'Disaster Ambulance & Trauma Line', number: '108', type: 'Medical Emergency Services' }
  ];

  return (
    <div className="sos-page">
      {/* Top Banner */}
      <div className="sos-page-header card-glass">
        <div className="sos-hdr-left">
          <div className="sos-hdr-icon">
            <AlertTriangleIcon className="w-8 h-8 text-danger" />
          </div>
          <div>
            <h2 className="sos-main-heading">EMERGENCY SOS COMMAND & DISPATCH</h2>
            <p className="sos-main-sub">
              Decentralized Peer-to-Peer Distress Beacon transmitting over LoRa Mesh Radio (868 MHz) without cellular dependency.
            </p>
          </div>
        </div>
      </div>

      {/* Main SOS Action Center */}
      <div className="sos-grid-layout">
        {/* Left Column: Big SOS Action Card */}
        <div className="card-glass sos-trigger-card">
          <div className="sos-action-header">
            <span className="action-tag">LIFE SAFETY BEACON</span>
            <span className="mesh-tag">48 MESH RELAYS ACTIVE</span>
          </div>

          <div className="beacon-hero-box">
            {sosActive ? (
              <div className="active-broadcast-wrapper">
                <div className="radar-beacon-active">
                  <span className="beacon-icon">📡</span>
                </div>
                <h3 className="active-b-title">EMERGENCY DISTRESS BEACON ACTIVE</h3>
                <p className="active-b-sub">
                  Broadcasting coordinates to NDRF Rescue Unit 02 and Coast Guard Dispatchers.
                </p>

                <div className="telemetry-summary-card">
                  <div className="tel-line">
                    <span>Packet ID:</span>
                    <strong className="text-cyan">#{sosPayload?.id}</strong>
                  </div>
                  <div className="tel-line">
                    <span>Emergency Category:</span>
                    <strong>{sosPayload?.category}</strong>
                  </div>
                  <div className="tel-line">
                    <span>GPS Telemetry:</span>
                    <strong className="text-cyan">18.5204° N, 73.8567° E</strong>
                  </div>
                  <div className="tel-line">
                    <span>Mesh Hops:</span>
                    <strong>{sosPayload?.meshHops} Hops (22ms latency)</strong>
                  </div>
                </div>

                <button className="btn-cancel-broadcast" onClick={cancelSos}>
                  STAND DOWN / CANCEL SOS TRANSMISSION
                </button>
              </div>
            ) : (
              <div className="idle-broadcast-wrapper">
                <p className="sos-explainer">
                  Press the button below if you are trapped, injured, or surrounded by rising flood water.
                  Your exact GPS coordinates and distress telemetry will be broadcast to all emergency units.
                </p>

                <button className="btn-sos-massive" onClick={() => setSosModalOpen(true)}>
                  <AlertTriangleIcon className="w-10 h-10" />
                  <span className="massive-text">TRIGGER DISTRESS BEACON</span>
                  <span className="massive-sub">INSTANT GPS LOCK & DISPATCH</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Emergency Helplines & Survival Tips */}
        <div className="sos-secondary-col">
          {/* Emergency Helplines */}
          <div className="card-glass contacts-card">
            <h3 className="card-title-sm">
              <PhoneCallIcon className="w-4 h-4 text-cyan" />
              <span>DIRECT EMERGENCY HOTLINES</span>
            </h3>

            <div className="contacts-list">
              {emergencyContacts.map((contact, idx) => (
                <div key={idx} className="contact-item">
                  <div className="contact-agency-info">
                    <span className="agency-name">{contact.agency}</span>
                    <span className="agency-type">{contact.type}</span>
                  </div>
                  <a href={`tel:${contact.number.split('/')[0].trim()}`} className="contact-dial-btn">
                    📞 {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Survival Protocols */}
          <div className="card-glass protocols-card">
            <h3 className="card-title-sm">
              <ShieldIcon className="w-4 h-4 text-emerald-400" />
              <span>IMMEDIATE SURVIVAL PROTOCOL</span>
            </h3>

            <div className="protocol-list">
              <div className="proto-item">
                <span className="proto-num">1</span>
                <span className="proto-text">Move vertically to the highest floor or elevated ridge. Never stay in a basement or closed ground floor.</span>
              </div>
              <div className="proto-item">
                <span className="proto-num">2</span>
                <span className="proto-text">Keep phone battery preserved; ResQ Mesh uses low-energy telemetry broadcasts every 60 seconds.</span>
              </div>
              <div className="proto-item">
                <span className="proto-num">3</span>
                <span className="proto-text">Signal rescue helicopters using bright clothing, reflective foil blankets, or rhythmic flashlight pulses.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .sos-page {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .sos-page-header {
          padding: 1.5rem;
        }

        .sos-hdr-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .sos-hdr-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid var(--danger);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sos-main-heading {
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
        }

        .sos-main-sub {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-top: 0.35rem;
          max-width: 800px;
        }

        .sos-grid-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 1.25rem;
          align-items: start;
        }

        .sos-trigger-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .sos-action-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .action-tag {
          color: var(--danger);
          letter-spacing: 0.06em;
        }

        .mesh-tag {
          color: var(--cyan);
          background: rgba(6, 182, 212, 0.1);
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .beacon-hero-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1rem 0;
        }

        .sos-explainer {
          font-size: 0.88rem;
          color: #cbd5e1;
          line-height: 1.5;
          margin-bottom: 2rem;
          max-width: 480px;
        }

        .btn-sos-massive {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          max-width: 380px;
          height: 180px;
          background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: var(--radius-xl);
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 10px 40px rgba(239, 68, 68, 0.5);
          transition: all 0.25s ease;
        }

        .btn-sos-massive:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 50px rgba(239, 68, 68, 0.7);
        }

        .massive-text {
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          font-family: var(--font-main);
        }

        .massive-sub {
          font-size: 0.75rem;
          font-weight: 700;
          color: #fca5a5;
          letter-spacing: 0.08em;
        }

        .radar-beacon-active {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.2);
          border: 3px solid var(--danger);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse-red 2s infinite;
          margin: 0 auto 1.25rem;
        }

        .beacon-icon {
          font-size: 2.5rem;
        }

        .active-b-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #f87171;
        }

        .active-b-sub {
          font-size: 0.85rem;
          color: #cbd5e1;
          margin-top: 0.35rem;
          max-width: 440px;
        }

        .telemetry-summary-card {
          width: 100%;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1rem 1.25rem;
          margin: 1.25rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
        }

        .tel-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .btn-cancel-broadcast {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .btn-cancel-broadcast:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #fca5a5;
        }

        .sos-secondary-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .contacts-card, .protocols-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .card-title-sm {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #ffffff;
        }

        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          gap: 0.75rem;
        }

        .contact-agency-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .agency-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
        }

        .agency-type {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .contact-dial-btn {
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.35);
          color: var(--cyan);
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 700;
          font-family: var(--font-mono);
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          white-space: nowrap;
        }

        .contact-dial-btn:hover {
          background: var(--cyan);
          color: #080c16;
        }

        .protocol-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .proto-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
        }

        .proto-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          font-size: 0.72rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .proto-text {
          font-size: 0.8rem;
          color: #cbd5e1;
          line-height: 1.4;
        }

        @media (max-width: 960px) {
          .sos-grid-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
