import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  reportsData,
  REPORT_TABS,
  ZONE_CHART_LABELS,
  fleetStatusBreakdown,
  optimizationTips,
  isNegativeChange,
} from "../data/mockData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("This Week");

  const currentData = reportsData[activeTab] || reportsData["This Week"];

  // Chart 1 Options & Data
  const fuelOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(195, 198, 215, 0.2)' } },
      x: { grid: { display: false } },
    },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 4, hitRadius: 10, hoverRadius: 6 }
    }
  };
  const fuelData = {
    labels: currentData.lineLabels,
    datasets: [{
      fill: true,
      data: currentData.fuelPoints,
      borderColor: '#004ac6',
      backgroundColor: 'rgba(0, 74, 198, 0.15)',
      borderWidth: 2,
    }],
  };

  // Chart 2 Options & Data
  const skippedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, grid: { color: 'rgba(195, 198, 215, 0.2)' } },
      x: { grid: { display: false } },
    },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 4 }
    }
  };
  const skippedData = {
    labels: currentData.lineLabels,
    datasets: [{
      data: currentData.skippedPoints,
      borderColor: '#737686',
      backgroundColor: 'transparent',
      borderWidth: 2,
    }],
  };

  // Chart 3 Options & Data
  const timingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(195, 198, 215, 0.2)' } },
      x: { grid: { display: false } },
    },
  };
  const timingData = {
    labels: currentData.timingLabels,
    datasets: [{
      data: currentData.timingPoints,
      backgroundColor: (context) => {
        const index = context.dataIndex;
        return index < 3 ? '#004ac6' : '#006e2d';
      },
      borderRadius: 4,
    }],
  };

  // Chart 4 Options & Data
  const zoneOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(195, 198, 215, 0.2)' } },
      y: { grid: { display: false } },
    },
  };
  const zoneData = {
    labels: ZONE_CHART_LABELS,
    datasets: [{
      data: currentData.zonePoints,
      backgroundColor: '#004ac6',
      borderRadius: 4,
      barThickness: 12,
    }],
  };

  // KPI cards — driven by backend data
  const kpis = [
    { label: "FUEL SAVED",         value: currentData.fuelSaved,   pct: currentData.fuelSavedPct },
    { label: "CO₂ AVOIDED",        value: currentData.co2Avoided,  pct: currentData.co2AvoidedPct },
    { label: "AVG ROUTE EFFICIENCY", value: currentData.efficiency, pct: currentData.efficiencyPct },
    { label: "TOTAL COLLECTIONS",   value: currentData.collections },
  ];

  const currentTip = optimizationTips[0];

  return (
    <div className="pt-24 pb-lg px-lg min-h-screen max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface mb-1">Analytics</h1>
          <p className="font-body-md text-on-surface-variant">Performance metrics and route optimization historical data.</p>
        </div>
        
        {/* Date Tabs — driven by REPORT_TABS */}
        <div className="bg-surface-container-low border border-outline-variant p-1 rounded-full flex self-start md:self-auto max-w-full overflow-x-auto custom-scrollbar">
          {REPORT_TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-md py-1.5 rounded-full font-body-sm whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "bg-surface border border-outline-variant text-on-surface shadow-sm" 
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row — driven by backend data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-surface border-standard p-md rounded-lg flex flex-col gap-sm">
            <p className="font-label-caps text-on-surface-variant tracking-wider">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <span className="font-metric-lg text-on-surface">{kpi.value}</span>
              {kpi.pct && (
                <span className={`font-body-md font-medium ${isNegativeChange(kpi.pct) ? 'text-error' : 'text-secondary'}`}>{kpi.pct}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        
        {/* Charts Container */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-md">
          
          <div className="bg-surface border-standard p-md rounded-lg flex flex-col">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-h2 text-on-surface">Fuel Saved</h3>
              <button className="text-on-surface-variant"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
            <div className="h-[240px] w-full">
              <Line options={fuelOptions} data={fuelData} />
            </div>
          </div>

          <div className="bg-surface border-standard p-md rounded-lg flex flex-col relative">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-h2 text-on-surface">Bins Skipped</h3>
              <button className="text-on-surface-variant"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
            <div className="h-[240px] w-full relative">
              <Line options={skippedOptions} data={skippedData} />
              {/* Zero Baseline */}
              <div className="absolute bottom-[30px] left-8 right-0 border-b-2 border-dashed border-error opacity-50 z-0"></div>
            </div>
          </div>

          <div className="bg-surface border-standard p-md rounded-lg flex flex-col">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-h2 text-on-surface">Collection Timing</h3>
              <button className="text-on-surface-variant"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
            <div className="h-[240px] w-full">
              <Bar options={timingOptions} data={timingData} />
            </div>
          </div>

          <div className="bg-surface border-standard p-md rounded-lg flex flex-col">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-h2 text-on-surface">Collection by Zone</h3>
              <button className="text-on-surface-variant"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
            <div className="h-[240px] w-full">
              <Bar options={zoneOptions} data={zoneData} />
            </div>
          </div>

        </div>

        {/* Right Sidebar Panels */}
        <div className="lg:col-span-4 space-y-md">
          
          {/* Fleet Status — driven by backend fleetStatusBreakdown */}
          <div className="bg-surface border-standard p-md rounded-lg">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-h2 text-on-surface">Current Fleet Status</h3>
              <span className="font-metric-lg text-on-surface">{fleetStatusBreakdown.total}</span>
            </div>
            
            <div className="h-2 w-full flex rounded-full overflow-hidden mb-lg">
              {fleetStatusBreakdown.segments.map((seg) => (
                <div key={seg.label} className={`${seg.color} h-full`} style={{ width: seg.width }}></div>
              ))}
            </div>

            <div className="space-y-sm">
              {fleetStatusBreakdown.segments.map((seg, i) => (
                <div key={seg.label} className={`flex justify-between items-center ${i < fleetStatusBreakdown.segments.length - 1 ? 'border-b border-outline-variant pb-xs' : ''}`}>
                  <div className="flex items-center gap-xs">
                    <div className={`w-2.5 h-2.5 rounded-full ${seg.color}`}></div>
                    <span className="font-label-caps text-on-surface-variant tracking-wider">{seg.label}</span>
                  </div>
                  <span className="font-id-mono text-on-surface">{seg.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Tip — driven by backend optimizationTips */}
          <div className="bg-primary-fixed dark:bg-[#1e2a4f] border border-primary-fixed-dim rounded-xl p-md flex flex-col gap-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <span className="material-symbols-outlined text-[100px] text-primary">lightbulb</span>
            </div>
            
            <div className="flex items-center gap-sm relative z-10">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>lightbulb</span>
              <h3 className="font-h2 text-on-primary-fixed dark:text-inverse-primary">{currentTip.title}</h3>
            </div>
            
            <p className="font-body-sm text-on-primary-fixed-variant dark:text-[#b4c5ff] leading-relaxed relative z-10">
              {currentTip.body}
            </p>
            
            <button className="mt-xs self-start bg-primary text-on-primary px-md py-2 rounded font-label-caps tracking-wider hover:bg-primary-container transition-colors active:scale-95 shadow-sm relative z-10">
              {currentTip.action}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
