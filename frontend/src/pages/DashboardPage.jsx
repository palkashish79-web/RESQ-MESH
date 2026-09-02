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
      {/* Top Operations Stat Counters */}
      <div className="grid-stats">
        <StatCard
          title="Incident Threat Index"
          value={`${scenario.riskScore}/100`}
          subtext={scenario.threatLevel}
          icon={AlertTriangleIcon}
          trend="LIVE GAUGE"
          color="danger"
        />
        <StatCard
          title="Active Alerts"
          value={currentAlerts.length}
          subtext={`${criticalAlertsCount} Critical Evacuations`}
          icon={ActivityIcon}
          trend="+2 New"
          color="warning"
        />
        <StatCard
          title="Operational Shelters"
          value={`${openSheltersCount} Open`}
          subtext="920 Total Open Beds"
          icon={ShelterIcon}
          trend="82% Capacity"
          color="success"
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

      {/* Main Two-Column Dashboard Layout */}
      <div className="grid-dashboard">
        {/* Left Column: Risk, Alerts, Safe Routes, Shelters */}
        <div className="dashboard-col">
          <DisasterRiskCard />
          <AlertsSection limit={3} showViewAll={true} />
          <SafeRouteSection />
          <SheltersSection limit={2} showViewAll={true} />
        </div>

        {/* Right Column: Weather & AI Disaster Assistant */}
        <div className="dashboard-col">
          <WeatherCard />
          <AiAssistantSection />
        </div>
      </div>

      <style>{`
        .dashboard-view {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 0;
          width: 100%;
        }
      `}</style>
    </div>
  );
};
