// ═══════════════════════════════════════════════════════════════════
// BinRoute — Centralized Backend Data Layer
// All mock data & computed helpers used across the entire frontend
// ═══════════════════════════════════════════════════════════════════

// ─── Map Configuration ───────────────────────────────────────────
export const MUMBAI_MAP_CONFIG = {
  embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241318.121973907!2d72.87835265000001!3d19.081507449999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1779013141701!5m2!1sen!2sin",
  center: { lat: 19.0760, lng: 72.8777 },
  city: "Mumbai",
  date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
};

// Legacy alias
export const mumbaiMapEmbedUrl = MUMBAI_MAP_CONFIG.embedUrl;

// ─── Bins ────────────────────────────────────────────────────────
export const mockBins = [
  { id: "BN-2244", zone: "Central Business", lat: 18.922, lng: 72.833, fill: 92, status: "critical", x: 480, y: 500, lastReading: "12 min ago", sensorBattery: 78 },
  { id: "BN-1089", zone: "Marine Drive",     lat: 18.944, lng: 72.823, fill: 100, status: "critical", x: 440, y: 580, lastReading: "5 min ago",  sensorBattery: 65 },
  { id: "BN-3301", zone: "Riverside North",  lat: 19.021, lng: 72.856, fill: 67,  status: "warning",  x: 570, y: 340, lastReading: "8 min ago",  sensorBattery: 82 },
  { id: "BN-4412", zone: "Industrial West",  lat: 19.073, lng: 72.864, fill: 34,  status: "ok",       x: 620, y: 220, lastReading: "3 min ago",  sensorBattery: 91 },
  { id: "BN-5520", zone: "Bandra East",      lat: 19.059, lng: 72.846, fill: 78,  status: "warning",  x: 600, y: 280, lastReading: "6 min ago",  sensorBattery: 74 },
  { id: "BN-6607", zone: "Dadar Market",     lat: 19.018, lng: 72.844, fill: 49,  status: "ok",       x: 530, y: 400, lastReading: "10 min ago", sensorBattery: 88 },
  { id: "BN-7780", zone: "Worli Link",       lat: 19.000, lng: 72.817, fill: 88,  status: "critical", x: 500, y: 460, lastReading: "2 min ago",  sensorBattery: 70 },
];

// ─── Routes ──────────────────────────────────────────────────────
export const mockRoutes = [
  {
    id: "R-001", driver: "Rahul Sharma", vehicle: "TR-202", status: "in_progress",
    progress: 64, stops: 14, completedStops: 9, km: 34.7, color: "primary",
    estimatedEnd: "16:45", fuelUsed: 3.2,
    nextStops: [
      { binId: "BN-1089", zone: "Marine Drive" },
      { binId: "BN-3301", zone: "Riverside North" },
    ],
  },
  {
    id: "R-002", driver: "Priya Nair", vehicle: "TR-505", status: "completed",
    progress: 100, stops: 12, completedStops: 12, km: 28.3, color: "secondary",
    estimatedEnd: "14:20", fuelUsed: 2.8,
    nextStops: [],
  },
  {
    id: "R-003", driver: "Amir Khan", vehicle: "TR-101", status: "scheduled",
    progress: 0, stops: 10, completedStops: 0, km: null, color: "tertiary",
    estimatedEnd: "—", fuelUsed: 0,
    nextStops: [
      { binId: "BN-4412", zone: "Industrial West" },
      { binId: "BN-6607", zone: "Dadar Market" },
    ],
  },
  {
    id: "R-004", driver: "Sneha Iyer", vehicle: "TR-809", status: "delayed",
    progress: 38, stops: 11, completedStops: 4, km: 31.1, color: "error",
    estimatedEnd: "17:30", fuelUsed: 4.1,
    nextStops: [
      { binId: "BN-7780", zone: "Worli Link" },
      { binId: "BN-2244", zone: "Central Business" },
    ],
  },
];

// ─── Activity Feed ───────────────────────────────────────────────
export const mockActivity = [
  { id: 1, type: "delay",    icon: "local_shipping", title: "Truck delay",       time: "14:22", color: "orange-500", bgColor: "bg-orange-500",         desc: "Vehicle #TR-809 stuck in heavy traffic at Worli Sea Link. Delaying Route B-04 by 12m." },
  { id: 2, type: "overflow", icon: "report_problem",  title: "Overflow risk",     time: "14:15", color: "error",      bgColor: "bg-error-container",    desc: "Bin #BN-2244 in Colaba exceeding 90% capacity. Pickup requested immediately." },
  { id: 3, type: "full",     icon: "delete_forever",  title: "Capacity reached",  time: "13:58", color: "error",      bgColor: "bg-error-container",    desc: "Bin #BN-1089 at Marine Drive is full. Diverting Vehicle #TR-202 for bypass." },
  { id: 4, type: "done",     icon: "check_circle",    title: "Stop completed",    time: "13:45", color: "secondary",  bgColor: "bg-secondary-container", desc: "Vehicle #TR-505 finished Route A-12. Returning to Central Depot for disposal." },
  { id: 5, type: "sensor",   icon: "sensors",         title: "Sensor alert",      time: "13:30", color: "orange-500", bgColor: "bg-orange-500",         desc: "Bin #BN-5520 sensor battery below 20%. Maintenance team notified." },
  { id: 6, type: "route",    icon: "alt_route",       title: "Route optimized",   time: "13:12", color: "secondary",  bgColor: "bg-secondary-container", desc: "AI rerouted R-001 to avoid congestion on Pedder Road. ETA improved by 8m." },
  { id: 7, type: "pickup",   icon: "recycling",       title: "Pickup completed",  time: "12:55", color: "secondary",  bgColor: "bg-secondary-container", desc: "Vehicle #TR-202 emptied Bin #BN-6607 at Dadar Market. Fill reset to 0%." },
  { id: 8, type: "delay",    icon: "local_shipping",  title: "Vehicle breakdown",  time: "12:40", color: "error",      bgColor: "bg-error-container",    desc: "TR-101 reported engine warning near Bandra Station. Backup dispatched." },
];

// ─── Vehicles / Fleet ────────────────────────────────────────────
export const mockVehicles = [
  { id: "TR-101", type: "Heavy Compactor", status: "standby",   driver: "Amir Khan",     fuelLevel: 72, mileage: 45230, lastService: "2026-04-28" },
  { id: "TR-202", type: "Light EV",        status: "active",    driver: "Rahul Sharma",  fuelLevel: 58, mileage: 31400, lastService: "2026-05-01" },
  { id: "TR-505", type: "Heavy Compactor", status: "active",    driver: "Priya Nair",    fuelLevel: 40, mileage: 62100, lastService: "2026-04-15" },
  { id: "TR-809", type: "Light EV",        status: "delayed",   driver: "Sneha Iyer",    fuelLevel: 34, mileage: 28900, lastService: "2026-05-10" },
];

export const VEHICLE_STATUS_MAP = {
  active:   { label: "On Route",       indicator: "bg-secondary" },
  delayed:  { label: "Traffic Delay",  indicator: "bg-orange-500" },
  standby:  { label: "Standby",        indicator: "border-2 border-outline-variant" },
  depot:    { label: "At Depot",       indicator: "bg-primary" },
};

// ─── Zones ───────────────────────────────────────────────────────
export const mockZones = [
  { name: "Central Business", bins: 20, area: "12.4 km²", collector: "TR-202" },
  { name: "Riverside North",  bins: 35, area: "18.1 km²", collector: "TR-505" },
  { name: "Industrial West",  bins: 50, area: "24.6 km²", collector: "TR-101" },
  { name: "Residential South", bins: 65, area: "31.2 km²", collector: "TR-809" },
];

// Zone labels for the map overlay
export const MAP_ZONE_LABELS = [
  ["Colaba / SoBo", 480, 540],
  ["Marine Drive",  420, 620],
  ["Dadar",         540, 380],
  ["Bandra",        580, 260],
  ["Andheri",       640, 180],
];

// ─── Dashboard KPIs ──────────────────────────────────────────────
export const dashboardKPIs = [
  { label: "ACTIVE BINS",       value: "42", change: "+23", changeIcon: "arrow_upward",  changeColor: "text-secondary" },
  { label: "REQUIRE COLLECTION", value: "5",  change: "+4",  changeIcon: "warning",       changeColor: "text-error" },
  { label: "TRUCKS ACTIVE",     value: "2",  dots: [
    { color: "bg-orange-500" }, { color: "bg-orange-500" },
    { color: "bg-green-500" },  { color: "bg-green-500" },
  ]},
  { label: "ROUTE EFFICIENCY",  value: "87.4%", change: "+3.2%", changeIcon: "trending_up", changeColor: "text-tertiary" },
];

// ─── Routes Page KPIs ────────────────────────────────────────────
export const routesKPIs = [
  { label: "TOTAL ROUTES",     value: String(mockRoutes.length) },
  { label: "BINS MANAGED",     value: String(mockRoutes.reduce((sum, r) => sum + r.stops, 0)) },
  { label: "DISTANCE COVERED", value: `${mockRoutes.reduce((sum, r) => sum + (r.km ?? 0), 0).toFixed(1)} km` },
  { label: "FUEL CONSUMED",    value: `${mockRoutes.reduce((sum, r) => sum + r.fuelUsed, 0).toFixed(1)} L` },
];

// ─── Analytics / Reports Data ────────────────────────────────────
export const REPORT_TABS = ["Today", "This Week", "This Month", "This Year", "All Time"];

export const reportsData = {
  "Today": {
    fuelSaved: "142 L",     fuelSavedPct: "+4%",
    co2Avoided: "0.4 T",    co2AvoidedPct: "+2%",
    efficiency: "89.1%",    efficiencyPct: "+5%",
    collections: "184",
    lineLabels: ['6a', '8a', '10a', '12p', '2p', '4p', '6p'],
    fuelPoints: [18, 22, 28, 35, 32, 24, 15],
    skippedPoints: [0, 1, 0, 2, 0, 1, 0],
    timingLabels: ['6a', '8a', '10a', '12p', '2p', '4p', '6p'],
    timingPoints: [12, 45, 30, 15, 38, 25, 10],
    zonePoints: [28, 24, 18, 12],
  },
  "This Week": {
    fuelSaved: "2,482 L",   fuelSavedPct: "+12%",
    co2Avoided: "6.4 T",    co2AvoidedPct: "+8%",
    efficiency: "84.2%",    efficiencyPct: "+2%",
    collections: "1,120",
    lineLabels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    fuelPoints: [18, 22, 17, 28, 24, 31, 26],
    skippedPoints: [3, 1, 4, 2, 0, 2, 1],
    timingLabels: ['6a', '8a', '10a', '12p', '2p', '4p', '6p'],
    timingPoints: [85, 310, 240, 120, 260, 190, 80],
    zonePoints: [87, 72, 61, 45],
  },
  "This Month": {
    fuelSaved: "10,840 L",  fuelSavedPct: "+15%",
    co2Avoided: "28.1 T",   co2AvoidedPct: "+11%",
    efficiency: "82.5%",    efficiencyPct: "-1%",
    collections: "4,680",
    lineLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    fuelPoints: [142, 156, 138, 164],
    skippedPoints: [12, 8, 15, 6],
    timingLabels: ['Morning', 'Midday', 'Afternoon', 'Evening'],
    timingPoints: [1450, 680, 1240, 420],
    zonePoints: [380, 310, 250, 190],
  },
  "This Year": {
    fuelSaved: "124,500 L", fuelSavedPct: "+24%",
    co2Avoided: "324.8 T",  co2AvoidedPct: "+18%",
    efficiency: "86.4%",    efficiencyPct: "+6%",
    collections: "58,200",
    lineLabels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    fuelPoints: [640, 680, 710, 820, 950, 890, 920, 1050, 1100, 1150, 1200, 1250],
    skippedPoints: [45, 38, 52, 41, 29, 34, 48, 22, 18, 15, 12, 9],
    timingLabels: ['Morning', 'Midday', 'Afternoon', 'Evening'],
    timingPoints: [18400, 9200, 15600, 5800],
    zonePoints: [4800, 3900, 3200, 2400],
  },
  "All Time": {
    fuelSaved: "482,100 L", fuelSavedPct: "+42%",
    co2Avoided: "1,250.4 T", co2AvoidedPct: "+36%",
    efficiency: "81.2%",     efficiencyPct: "+14%",
    collections: "245,800",
    lineLabels: ['2023', '2024', '2025', '2026'],
    fuelPoints: [4200, 5800, 8400, 12450],
    skippedPoints: [450, 320, 210, 85],
    timingLabels: ['Morning', 'Midday', 'Afternoon', 'Evening'],
    timingPoints: [85000, 42000, 71000, 24000],
    zonePoints: [18500, 15200, 12800, 9400],
  },
};

export const ZONE_CHART_LABELS = ["Central", "Riverside", "Industrial", "Residential"];

// ─── Fleet Status (Analytics sidebar) ────────────────────────────
export const fleetStatusBreakdown = {
  total: 57,
  segments: [
    { label: "EMPTY",    color: "bg-secondary",  count: 31, width: "54%" },
    { label: "WARNING",  color: "bg-orange-500", count: 18, width: "32%" },
    { label: "CRITICAL", color: "bg-error",      count: 5,  width: "9%" },
    { label: "EN ROUTE", color: "bg-primary",    count: 3,  width: "5%" },
  ],
};

// ─── Optimization Tips ───────────────────────────────────────────
export const optimizationTips = [
  {
    id: 1,
    title: "Optimization Tip",
    body: "Route R-003 has 3 consecutive low-fill bins. Consider merging with R-002 to reduce fuel by ~1.8L daily.",
    action: "APPLY SUGGESTION",
  },
  {
    id: 2,
    title: "Schedule Insight",
    body: "Peak collection hours (8a-10a) handle 42% of daily volume. Shifting 2 vehicles earlier could reduce delays by 18%.",
    action: "VIEW DETAILS",
  },
];

// ─── Settings Defaults ───────────────────────────────────────────
export const settingsDefaults = {
  platformName: "BinRoute",
  cityJurisdiction: "Mumbai",
  collectionThreshold: 60,
  maxStopsPerVehicle: 45,
  shiftStart: "06:00",
  shiftEnd: "18:00",
  activeDays: [true, true, true, true, true, true, false], // M T W T F S S
  toggles: {
    aiRoute: true,
    dynamicRerouting: true,
    dailyReport: false,
    realtimeSync: true,
  },
};

export const SETTINGS_NAV_SECTIONS = [
  { title: "PLATFORM",   items: ["General", "Appearance", "Notifications"] },
  { title: "OPERATIONS",  items: ["Fleet Management", "Zone Configuration", "Schedule"] },
];

export const NOTIFICATION_ALERTS = [
  "Critical Bin Levels (>85%)",
  "Truck Route Deviations",
  "System Errors & Downtime",
  "End of Shift Summaries",
];

// ─── System Logs ─────────────────────────────────────────────────
export const systemLogs = [
  { ts: "2026-05-17 14:02:11", level: "INFO",  msg: "Vehicle TR-202 sync successful." },
  { ts: "2026-05-17 14:05:32", level: "WARN",  msg: "Bin 4B-902 offline for 2 hours." },
  { ts: "2026-05-17 14:12:01", level: "INFO",  msg: "API request /v1/routes completed in 142ms." },
  { ts: "2026-05-17 14:20:44", level: "ERROR", msg: "Webhook delivery failed (HTTP 500) to https://muniapp.local/webhook." },
  { ts: "2026-05-17 14:25:18", level: "INFO",  msg: "Route R-002 marked complete. 12/12 stops collected." },
  { ts: "2026-05-17 14:32:07", level: "WARN",  msg: "Sensor BN-5520 battery at 18%. Replacement scheduled." },
  { ts: "2026-05-17 14:38:55", level: "INFO",  msg: "Daily report generated. 184 collections processed." },
  { ts: "2026-05-17 14:45:22", level: "ERROR", msg: "GPS signal lost for TR-809 (duration: 45s). Auto-reconnected." },
];

// ─── System Overview (Settings sidebar) ──────────────────────────
export const systemOverview = {
  totalBins: 42,
  activeVehicles: 4,
  zonesConfigured: 4,
  lastSync: "2 min ago",
  version: "v2.4.1",
};

// ═══════════════════════════════════════════════════════════════════
// Helper / Computed Functions
// ═══════════════════════════════════════════════════════════════════

/** Get bins filtered by status */
export const getBinsByStatus = (status) => mockBins.filter((b) => b.status === status);

/** Get bins that need collection (fill > threshold) */
export const getBinsNeedingCollection = (threshold = 80) => mockBins.filter((b) => b.fill >= threshold);

/** Get total distance covered by all active routes */
export const getTotalRouteDistance = () =>
  mockRoutes.reduce((sum, r) => sum + (r.km ?? 0), 0);

/** Get active vehicle count */
export const getActiveVehicleCount = () =>
  mockVehicles.filter((v) => v.status === "active").length;

/** Get route by ID */
export const getRouteById = (id) => mockRoutes.find((r) => r.id === id);

/** Get vehicle by ID */
export const getVehicleById = (id) => mockVehicles.find((v) => v.id === id);

/** Check if a percentage change is negative */
export const isNegativeChange = (pctString) => pctString.startsWith("-");
