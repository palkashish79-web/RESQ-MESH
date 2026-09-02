import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { StatCard } from '../components/StatCard';
import { DisasterRiskCard } from '../components/DisasterRiskCard';
import { WeatherCard } from '../components/WeatherCard';
import { AlertsSection } from '../components/AlertsSection';
import { SheltersSection } from '../components/SheltersSection';
import { SafeRouteSection } from '../components/SafeRouteSection';
import { AiAssistantSection } from '../components/AiAssistantSection';
import { AlertTriangleIcon, ShelterIcon, RouteIcon, UsersIcon, ActivityIcon, RadioIcon } from '../components/Icons';

export const DashboardPage = () => {
  const { scenario, currentAlerts, shelters } = useDisaster();

  const openSheltersCount = shelters.filter((s) => !s.status.includes('CLOSED')).length;
  const criticalAlertsCount = currentAlerts.filter((a) => a.priority === 'CRITICAL').length;

  return (
    <div className="dashboard-view">
      {/* Top Operations Stat Counters with Live Circular Gauges & Ambient Accents */}
      <div className="grid-stats">
        <StatCard
          title="Incident Threat Index"
          value={`${scenario.riskScore}/100`}
          subtext={scenario.threatLevel}
          icon={AlertTriangleIcon}
          trend="LIVE DIAL"
          color="danger"
          gaugeValue={scenario.riskScore}
        />
        <StatCard
          title="Active Alerts"
          value={`${currentAlerts.length} Active`}
          subtext={`${criticalAlertsCount} Evacuations Ordered`}
          icon={ActivityIcon}
          trend="+2 Broadcast"
          color="warning"
        />
        <StatCard
          title="Operational Shelters"
          value={`${openSheltersCount} Open`}
          subtext="920 Total Beds Verified"
          icon={ShelterIcon}
          trend="82% Occupied"
          color="success"
          gaugeValue={82}
        />
        <StatCard
          title="Response Units Online"
          value={scenario.activeResponseUnits}
          subtext="Boat, Heli & Ambulances"
          icon={UsersIcon}
          trend="48 Mesh Nodes"
          color="cyan"
        />
      </div>

      {/* Symmetrically Balanced Multi-Column Dashboard Layout utilizing Full Viewport Width */}
      <div className="grid-dashboard">
        {/* Column 1: Threat Assessment, Safe Evacuation Corridors, Operational Shelters */}
        <div className="dashboard-col">
          <DisasterRiskCard />
          <SafeRouteSection />
          <SheltersSection limit={2} showViewAll={true} />
        </div>

        {/* Column 2: Live Emergency Broadcast Alerts, Radar Weather Telemetry, AI Copilot */}
        <div className="dashboard-col">
          <AlertsSection limit={3} showViewAll={true} />
          <WeatherCard />
          <AiAssistantSection />
        </div>
      </div>

      <style>{`
        .dashboard-view {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          min-width: 0;
          width: 100%;
          max-width: 100%;
        }
      `}</style>
    </div>
  );
};
export default DashboardPage;
