// Comprehensive Mock Data for ResQ Mesh Emergency Platform

export const DISASTER_SCENARIOS = {
  'cyclone-surge': {
    id: 'cyclone-surge',
    title: 'Super Cyclone "Amphan-X" & Storm Surge',
    type: 'Cyclone / Coastal Flood',
    severity: 'CRITICAL',
    riskScore: 92,
    threatLevel: 'Severe Category 4',
    status: 'ACTIVE RED WARNING',
    affectedRadius: '45 km',
    impactZone: 'Coastal Sector 4 & Lower Delta Basin',
    evacuationUrgency: 'Immediate Mandatory Evacuation',
    populationAtRisk: '142,500 people',
    activeResponseUnits: 28,
    summary: 'Sustained destructive winds exceeding 165 km/h with an estimated 4.2m storm surge. Coastal dykes at Sector 4 showing active breach risk.',
    keyHazard: 'Storm Surge & Extreme Wind Shear',
    weather: {
      condition: 'Violent Rainstorm & Gale',
      temperature: '24°C',
      feelsLike: '21°C',
      rainfallRate: '48 mm/hr',
      rainfallAccumulation: '184 mm (Last 12h)',
      windSpeed: '142 km/h',
      windGusts: '175 km/h',
      windDirection: 'ENE (065°)',
      humidity: '98%',
      pressure: '942 hPa (Falling rapidly)',
      visibility: '0.8 km',
      uvIndex: '0 (Overcast)',
      radarStatus: 'Live Doppler Radar Tracking active storm eye at 22.4 km Offshore'
    },
    threatBreakdown: [
      { name: 'Storm Surge Inundation', score: 95, color: '#ef4444', desc: 'Water rise 3.5m - 4.5m along shoreline' },
      { name: 'Structural Wind Damage', score: 90, color: '#ef4444', desc: 'Roofs, hoardings & power poles at high failure risk' },
      { name: 'Flash Urban Flooding', score: 82, color: '#f59e0b', desc: 'Low-lying underpasses submerged (>1.2m water)' },
      { name: 'Grid & Telemetry Loss', score: 78, color: '#f59e0b', desc: 'Cell towers running on emergency backup mesh' }
    ]
  },
  'flash-flood': {
    id: 'flash-flood',
    title: 'Monsoon Flash Inundation & Debris Flow',
    type: 'Flash Flood / Mudslide',
    severity: 'HIGH',
    riskScore: 84,
    threatLevel: 'Tier 3 Red Inundation',
    status: 'RISING WATER LEVELS',
    affectedRadius: '30 km',
    impactZone: 'River Valley District & East Ridge',
    evacuationUrgency: 'Urgent Precautionary Evacuation',
    populationAtRisk: '86,200 people',
    activeResponseUnits: 19,
    summary: 'Continuous cloudburst dumped 210mm rainfall in 6 hours. Upper River reservoir discharging at maximum spillway capacity.',
    keyHazard: 'Submerged Roadways & Bridge Overwash',
    weather: {
      condition: 'Heavy Continuous Downpour',
      temperature: '22°C',
      feelsLike: '20°C',
      rainfallRate: '36 mm/hr',
      rainfallAccumulation: '220 mm (Last 6h)',
      windSpeed: '45 km/h',
      windGusts: '65 km/h',
      windDirection: 'SW (220°)',
      humidity: '99%',
      pressure: '998 hPa (Steady)',
      visibility: '2.1 km',
      uvIndex: '0 (Rain)',
      radarStatus: 'Hydrological sensor net: River depth +3.8m above danger mark'
    },
    threatBreakdown: [
      { name: 'Bridge & Causeway Flooding', score: 92, color: '#ef4444', desc: 'North causeway fully impassable' },
      { name: 'Hillside Slope Failure', score: 85, color: '#ef4444', desc: 'Debris flow risk on East Valley highway' },
      { name: 'Potable Water Contamination', score: 74, color: '#f59e0b', desc: 'Treatment plant switched to auxiliary chlorination' },
      { name: 'Power Line Submersion', score: 68, color: '#10b981', desc: 'Substations in Lowlands proactively de-energized' }
    ]
  },
  'wildfire-blaze': {
    id: 'wildfire-blaze',
    title: 'Ridge Fire Complex & High Smoke Front',
    type: 'Wildfire / Toxic Smoke',
    severity: 'CRITICAL',
    riskScore: 89,
    threatLevel: 'Extreme Fire Danger Index',
    status: 'RAPID ADVANCE (WEST FLANK)',
    affectedRadius: '38 km',
    impactZone: 'North Ridge Forest & Foothill Subdivisions',
    evacuationUrgency: 'Immediate Evacuation Order (Zones A & B)',
    populationAtRisk: '54,000 people',
    activeResponseUnits: 34,
    summary: 'Fast-moving blaze driven by erratic 55 km/h ridge winds. Dense smoke plume reducing visibility and deteriorating AQI to hazardous levels.',
    keyHazard: 'Ember Cast & Air Quality Crisis',
    weather: {
      condition: 'Extreme Dry Heat & Dense Smog',
      temperature: '39°C',
      feelsLike: '42°C',
      rainfallRate: '0 mm/hr',
      rainfallAccumulation: '0 mm (Drought condition)',
      windSpeed: '58 km/h',
      windGusts: '80 km/h',
      windDirection: 'NNW (330°)',
      humidity: '11%',
      pressure: '1012 hPa',
      visibility: '1.2 km (Smoke particulate)',
      uvIndex: '9 (Extreme)',
      radarStatus: 'Satellite thermal infrared detects 3 new spot-fire ignitions'
    },
    threatBreakdown: [
      { name: 'Wildland Perimeter Spread', score: 94, color: '#ef4444', desc: 'Advancing at 1.8 km/h towards West Foothills' },
      { name: 'Hazardous Air Quality (AQI 420)', score: 91, color: '#ef4444', desc: 'Severe respiratory risk; N95/P100 required outdoors' },
      { name: 'Embers Leaping Firebreaks', score: 86, color: '#f59e0b', desc: 'Spotted 600m ahead of main fireline' },
      { name: 'Evacuation Route Chokepoints', score: 70, color: '#f59e0b', desc: 'Route 102 closed; Route 4 South clear' }
    ]
  }
};

export const EMERGENCY_ALERTS = [
  {
    id: 'ALT-101',
    scenarioId: 'cyclone-surge',
    priority: 'CRITICAL',
    title: 'MANDATORY EVACUATION: Coastal Sector 4 & Low Basin',
    timestamp: '3 mins ago',
    source: 'National Emergency Management Bureau (NEMB)',
    location: 'Coastal Sectors 1-6 (< 5m elevation)',
    summary: 'Water level surging rapidly. Breaches observed at South Levee. All residents must evacuate to designated high-ground shelters immediately.',
    actionRequired: 'Move Inland via Route Alpha (High Ground Corridor). Do NOT attempt to cross causeways.',
    type: 'Evacuation',
    status: 'Active'
  },
  {
    id: 'ALT-102',
    scenarioId: 'cyclone-surge',
    priority: 'CRITICAL',
    title: 'Severe Infrastructure Alert: Victoria Bridge Inundated',
    timestamp: '14 mins ago',
    source: 'Department of Public Safety & Highways',
    location: 'Victoria Bridge (Connecting East & Central Sector)',
    summary: 'Structural integrity compromised due to heavy debris collision. Bridge closed in both directions.',
    actionRequired: 'Reroute to Metro Flyover or West Ring Expressway.',
    type: 'Road Hazard',
    status: 'Active'
  },
  {
    id: 'ALT-103',
    scenarioId: 'cyclone-surge',
    priority: 'WARNING',
    title: 'High-Tension Power Grid Emergency De-energization',
    timestamp: '28 mins ago',
    source: 'Regional Energy Grid Commission',
    location: 'Delta Substation Grid #2 & #4',
    summary: 'Preventative shutoff initiated to avoid catastrophic transformer explosions and electrocution hazards in submerged zones.',
    actionRequired: 'Rely on battery backup and ResQ Mesh low-frequency radio beacons.',
    type: 'Infrastructure',
    status: 'Active'
  },
  {
    id: 'ALT-104',
    scenarioId: 'cyclone-surge',
    priority: 'ADVISORY',
    title: 'Mobile Water Purification Unit Deployed at North Shelter',
    timestamp: '42 mins ago',
    source: 'Red Cross Disaster Relief Corps',
    location: 'North High School Shelter (Zone 2)',
    summary: 'Safe drinking water distribution active. 10,000L clean water and emergency rations available.',
    actionRequired: 'Bring clean storage containers if possible. Water is ration-free for all evacuees.',
    type: 'Relief & Supplies',
    status: 'Active'
  },
  {
    id: 'ALT-105',
    scenarioId: 'flash-flood',
    priority: 'CRITICAL',
    title: 'FLASH FLOOD EMERGENCY: East River Overflow',
    timestamp: '5 mins ago',
    source: 'Hydrological Warning Center',
    location: 'East Riverbank & Market District',
    summary: 'Water level rising at 30cm every 15 minutes. Ground floor buildings in Market District are taking on water.',
    actionRequired: 'Climb to second floor or move toward East High Ridge Community Shelter.',
    type: 'Evacuation',
    status: 'Active'
  },
  {
    id: 'ALT-106',
    scenarioId: 'wildfire-blaze',
    priority: 'CRITICAL',
    title: 'IMMEDIATE EVACUATION: West Foothills Community',
    timestamp: '2 mins ago',
    source: 'Forest Fire Unified Command',
    location: 'Zone A & B (Pine Crest to Oak Valley)',
    summary: 'Fireline shifted due to sudden 60 km/h wind shift. Smoke density is critical.',
    actionRequired: 'Evacuate South along Interstate Highway 4. Turn on vehicle headlights and hazard flashers.',
    type: 'Evacuation',
    status: 'Active'
  }
];

export const SHELTERS = [
  {
    id: 'SHL-01',
    name: 'North Central Civic Center (Primary Safe Hub)',
    type: 'Mega Shelter & Triage Base',
    distance: '1.2 km',
    elevation: '42m (High Ground Safe Zone)',
    capacityTotal: 1200,
    capacityOccupied: 780,
    status: 'OPEN & ACCEPTING',
    statusColor: '#10b981',
    address: '740 Grand Avenue, North Ridge Safe Zone',
    contact: '+1 (800) 555-RESQ (Ext 1)',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    amenities: [
      'Level-2 Medical Triage',
      'Backup Diesel Generators (72hr)',
      'Clean Water & Hot Meals',
      'Pet Shelter Area',
      'Wheelchair Accessible',
      'Child Safe Zone',
      'Mesh Radio Beacon'
    ],
    suppliesStatus: 'Plentiful (3-Day Buffer)',
    doctorOnSite: true,
    bedsAvailable: 420
  },
  {
    id: 'SHL-02',
    name: 'St. Jude Memorial Arena Shelter',
    type: 'Regional Evacuation Point',
    distance: '2.8 km',
    elevation: '38m (Safe Elevation)',
    capacityTotal: 850,
    capacityOccupied: 740,
    status: 'NEAR CAPACITY (87%)',
    statusColor: '#f59e0b',
    address: '120 Stadium Way, West Hills District',
    contact: '+1 (800) 555-RESQ (Ext 2)',
    coordinates: { lat: 18.5312, lng: 73.8421 },
    amenities: [
      'First Aid Station',
      'Food & Baby Formula',
      'Emergency Blankets & Cots',
      'Mobile Phone Charging Kiosk',
      'Sanitation Showers'
    ],
    suppliesStatus: 'Moderate',
    doctorOnSite: true,
    bedsAvailable: 110
  },
  {
    id: 'SHL-03',
    name: 'Summit Heights High School Shelter',
    type: 'Community Relief Center',
    distance: '4.1 km',
    elevation: '55m (Peak Safe Elevation)',
    capacityTotal: 600,
    capacityOccupied: 210,
    status: 'OPEN & ACCEPTING',
    statusColor: '#10b981',
    address: '950 Summit Ridge Road',
    contact: '+1 (800) 555-RESQ (Ext 3)',
    coordinates: { lat: 18.5489, lng: 73.8694 },
    amenities: [
      'Basic Medical Aid',
      'Solar Microgrid',
      'Packaged Food Rations',
      'Clean Potable Water Tanks',
      'Family Dormitories'
    ],
    suppliesStatus: 'Plentiful',
    doctorOnSite: false,
    bedsAvailable: 390
  },
  {
    id: 'SHL-04',
    name: 'Lowland Maritime Terminal (Former Shelter)',
    type: 'Waterfront Transit Point',
    distance: '3.4 km',
    elevation: '2.5m (HIGH RISK)',
    capacityTotal: 400,
    capacityOccupied: 0,
    status: 'CLOSED & EVACUATED (FLOOD RISK)',
    statusColor: '#ef4444',
    address: '1 Harbor View Blvd',
    contact: 'DECOMMISSIONED',
    coordinates: { lat: 18.4981, lng: 73.8123 },
    amenities: ['NO SERVICES - INUNDATED'],
    suppliesStatus: 'None (Evacuated)',
    doctorOnSite: false,
    bedsAvailable: 0
  }
];

export const SAFE_ROUTES = [
  {
    id: 'RT-ALPHA',
    name: 'Corridor Alpha: North High Ground Expressway',
    destination: 'North Central Civic Center',
    recommended: true,
    safetyScore: 96,
    estimatedTime: '11 mins (Drive) / 32 mins (Walk)',
    distance: '3.4 km',
    elevationProfile: 'Ascending (+32m climb, zero flood dip)',
    status: 'CLEAR & MONITORED',
    hazardsAvoided: [
      'Bypasses Lowland Underpass (Submerged 1.4m)',
      'Avoids Victoria Bridge Collision Zone',
      'Steers clear of down powerline sector #4'
    ],
    turnByTurn: [
      { step: 1, action: 'Head North on Parkline Blvd for 600m', safe: true },
      { step: 2, action: 'Turn right onto Ridgeview Overpass (Elevated Roadway)', safe: true },
      { step: 3, action: 'Continue 2.1 km along High Crest Highway (Free flowing)', safe: true },
      { step: 4, action: 'Take Exit 4B straight into North Civic Center Triage Gate', safe: true }
    ]
  },
  {
    id: 'RT-BETA',
    name: 'Corridor Beta: West Ridge Secondary Bypass',
    destination: 'St. Jude Memorial Arena',
    recommended: false,
    safetyScore: 78,
    estimatedTime: '19 mins (Drive) / 48 mins (Walk)',
    distance: '4.8 km',
    elevationProfile: 'Rolling hills, minor water pooling near Mile 2',
    status: 'PASSABLE WITH CAUTION',
    hazardsAvoided: [
      'Avoids main coastal artery',
      'Bypasses congested city center gridlock'
    ],
    turnByTurn: [
      { step: 1, action: 'Head West on Valley Street for 800m', safe: true },
      { step: 2, action: 'Caution: Shallow water pooling (10cm) near Rail Crossing', safe: false },
      { step: 3, action: 'Ascend West Hill Boulevard for 3.2 km', safe: true },
      { step: 4, action: 'Arrive at St. Jude Memorial Arena West Parking Entrance', safe: true }
    ]
  }
];

export const MAP_NODES = [
  { id: 'PIN-1', type: 'shelter', name: 'North Civic Center', lat: 38, lng: 62, status: 'safe', label: 'Civic Center (780/1200)' },
  { id: 'PIN-2', type: 'shelter', name: 'St. Jude Arena', lat: 24, lng: 32, status: 'warning', label: 'St. Jude Arena (87% Full)' },
  { id: 'PIN-3', type: 'hazard', name: 'Bridge Collapse / Surge Breach', lat: 54, lng: 48, status: 'danger', label: 'Victoria Bridge Closed' },
  { id: 'PIN-4', type: 'hazard', name: 'Submerged Underpass', lat: 68, lng: 70, status: 'danger', label: 'Water Depth: 1.4m' },
  { id: 'PIN-5', type: 'unit', name: 'Rescue Boat Unit 02', lat: 60, lng: 52, status: 'active', label: 'Water Rescue in progress' },
  { id: 'PIN-6', type: 'unit', name: 'Ambulance Unit 07', lat: 30, lng: 58, status: 'active', label: 'Paramedic Transit' },
  { id: 'PIN-7', type: 'sensor', name: 'Water Gauge S-12', lat: 72, lng: 38, status: 'danger', label: 'Water Level +4.2m' }
];

export const AI_KNOWLEDGE_BASE = {
  'shelter': 'The nearest safe high-ground shelter is **North Central Civic Center** (1.2 km away, 420 beds available, full medical staff & backup generator). Route Alpha is clear with a 96% safety score. Would you like direct navigation?',
  'food': 'Emergency rations and hot meals are currently being served at **North Central Civic Center** and **St. Jude Memorial Arena**. Both locations have infant formula and bottled water supplies.',
  'water': 'Tap water in flooded sectors is currently contaminated. Drink ONLY sealed bottled water or boil for at least 3 minutes. Clean water supply tankers are stationed at North High School Shelter (Gate 2).',
  'kit': 'Essential Emergency Go-Bag Checklist:\n1. 3-day supply of sealed water (3L/person/day) & non-perishable food.\n2. Prescriptions, medications & mini first aid kit.\n3. Waterproof pouch for ID, insurance & documents.\n4. Flashlight, extra batteries & portable power bank.\n5. Sturdy waterproof footwear & warm emergency blanket.\n6. Whistle (for signaling rescue crews without exhausting voice).',
  'flood': 'Flash Flood Survival Protocol:\n- **Never walk or drive through moving water** (just 15 cm of moving water can knock you down, and 30 cm can sweep away a car).\n- Disconnect electrical circuit breakers if safe to do so before water enters.\n- Move to the highest level of your building. If trapped on the roof, signal using bright clothing or a flashlight—do NOT enter a closed attic without roof access.\n- Trigger the ResQ Mesh Emergency SOS beacon if immediate extraction is required.',
  'firstaid': 'Emergency First-Aid Quick Guide:\n- **Bleeding:** Apply firm direct pressure with clean cloth. Elevate wound if possible.\n- **Hypothermia:** Remove wet clothing immediately, wrap in dry blankets/foil sheet, provide warm sweet liquids if conscious.\n- **Burns:** Cool under clean cold running water for 10-15 mins. Cover loosely with sterile dressing—never apply ice or oil.',
  'sos': 'If you or someone nearby is in immediate life-threatening danger, click the **EMERGENCY SOS** button in the top bar or sidebar. ResQ Mesh broadcasts your coordinates across local mesh relay nodes directly to emergency dispatchers even in weak cell signal areas.'
};

export const DEFAULT_AI_PROMPTS = [
  'Where is the safest shelter near me?',
  'What is the safest evacuation route right now?',
  'Emergency checklist: What should I pack in my Go-Bag?',
  'What should I do if water is entering my ground floor?',
  'How do I treat hypothermia or severe bleeding in a flood?',
  'Is tap water safe to drink in coastal sector 4?'
];
