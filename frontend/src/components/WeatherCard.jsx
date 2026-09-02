import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { WindIcon, RainIcon, DropletsIcon, ThermometerIcon, ActivityIcon, RadioIcon } from './Icons';

export const WeatherCard = () => {
  const { scenario } = useDisaster();
  const weather = scenario.weather;

  return (
    <div className="card-glass accent-cyan weather-card">
      <div className="card-header">
        <div className="card-header-title">
          <div className="header-icon-badge cyan">
            <WindIcon className="w-4 h-4 text-cyan" />
          </div>
          <span>MICROCLIMATE & RADAR TELEMETRY</span>
        </div>
        <div className="badge badge-cyan">
          <span className="blinking">●</span> DOPPLER RADAR ACTIVE
        </div>
      </div>

      <div className="card-body">
        {/* Weather Hero Header */}
        <div className="weather-hero">
          <div className="weather-primary">
            <div className="weather-temp-badge">
              <span className="temp-main">{weather.temperature}</span>
              <span className="temp-sub">Feels {weather.feelsLike}</span>
            </div>
            <div className="weather-condition-info">
              <span className="weather-cond-title">{weather.condition}</span>
              <span className="weather-radar-badge">{weather.radarStatus}</span>
            </div>
          </div>
        </div>

        {/* 2x2 Metric Grid */}
        <div className="weather-grid">
          <div className="weather-metric-tile">
            <div className="metric-icon-wrap">
              <RainIcon className="w-4 h-4 text-cyan" />
            </div>
            <div className="metric-info">
              <span className="metric-label">Rainfall Rate</span>
              <span className="metric-value">{weather.rainfallRate}</span>
              <span className="metric-sub">{weather.rainfallAccumulation}</span>
            </div>
          </div>

          <div className="weather-metric-tile">
            <div className="metric-icon-wrap">
              <WindIcon className="w-4 h-4 text-warning" />
            </div>
            <div className="metric-info">
              <span className="metric-label">Sustained Wind</span>
              <span className="metric-value">{weather.windSpeed}</span>
              <span className="metric-sub">Gusts: {weather.windGusts} ({weather.windDirection})</span>
            </div>
          </div>

          <div className="weather-metric-tile">
            <div className="metric-icon-wrap">
              <DropletsIcon className="w-4 h-4 text-cyan" />
            </div>
            <div className="metric-info">
              <span className="metric-label">Atmosphere</span>
              <span className="metric-value">Humidity {weather.humidity}</span>
              <span className="metric-sub">Pressure: {weather.pressure}</span>
            </div>
          </div>

          <div className="weather-metric-tile">
            <div className="metric-icon-wrap">
              <ActivityIcon className="w-4 h-4 text-purple" />
            </div>
            <div className="metric-info">
              <span className="metric-label">Optical Visibility</span>
              <span className="metric-value">{weather.visibility}</span>
              <span className="metric-sub">UV Index: {weather.uvIndex}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .weather-card {
          min-width: 0;
          width: 100%;
        }

        .weather-hero {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(13, 20, 36, 0.95) 100%);
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: var(--radius-md);
          padding: 0.75rem 0.95rem;
          margin-bottom: 0.85rem;
          min-width: 0;
        }

        .weather-primary {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
          min-width: 0;
        }

        .weather-temp-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.35rem 0.65rem;
          min-width: 68px;
          flex-shrink: 0;
        }

        .temp-main {
          font-size: 1.25rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: #ffffff;
          line-height: 1.1;
        }

        .temp-sub {
          font-size: 0.6rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
          white-space: nowrap;
        }

        .weather-condition-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
          flex: 1;
        }

        .weather-cond-title {
          font-size: 0.88rem;
          font-weight: 800;
          color: #ffffff;
          overflow-wrap: break-word;
        }

        .weather-radar-badge {
          font-size: 0.68rem;
          color: var(--cyan);
          line-height: 1.25;
          overflow-wrap: break-word;
        }

        .weather-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.55rem;
          min-width: 0;
          width: 100%;
        }

        .weather-metric-tile {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          background: #090f1d;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.55rem 0.75rem;
          min-width: 0;
        }

        .metric-icon-wrap {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .metric-info {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
          flex: 1;
        }

        .metric-label {
          font-size: 0.58rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .metric-value {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
          overflow-wrap: break-word;
        }

        .metric-sub {
          font-size: 0.62rem;
          color: var(--text-secondary);
          line-height: 1.25;
          overflow-wrap: break-word;
        }

        .text-purple {
          color: var(--purple);
        }

        @media (max-width: 640px) {
          .weather-primary {
            flex-direction: column;
            align-items: flex-start;
          }
          .weather-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
