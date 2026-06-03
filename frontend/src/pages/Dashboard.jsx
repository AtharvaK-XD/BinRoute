import { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  mockActivity,
  dashboardKPIs,
  MUMBAI_MAP_CONFIG,
  mockBins,
  mockRoutes,
  mockVehicles,
} from "../data/mockData";

function downloadCSV(filename, headers, rows) {
  const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export default function Dashboard() {
  const [toast, setToast] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDownloadReport = () => {
    const date = new Date().toISOString().split("T")[0];
    const headers = ["Metric", "Value", "Change", "Date"];
    const rows = dashboardKPIs.map(kpi => [kpi.label, kpi.value, kpi.change || "—", date]);
    rows.push([]);
    rows.push(["--- BIN STATUS REPORT ---", "", "", ""]);
    mockBins.forEach(b => rows.push([b.id, `${b.fill}% Full`, b.status, b.zone]));
    rows.push([]);
    rows.push(["--- ACTIVE ROUTES ---", "", "", ""]);
    mockRoutes.forEach(r => rows.push([r.id, r.driver, r.status, `${r.stops} stops`]));
    downloadCSV(`BinRoute_Report_${date}.csv`, headers, rows);
    showToast("Report downloaded successfully!");
  };

  const handleRegenerateRoutes = async () => {
    setIsRegenerating(true);
    showToast("Regenerating routes...", "info");
    await new Promise(r => setTimeout(r, 2000));
    setIsRegenerating(false);
    showToast(`${mockRoutes.length} routes regenerated with ${mockBins.filter(b => b.fill >= 60).length} priority bins!`);
  };

  return (
    <div className="pt-24 pb-lg px-lg xl:ml-64 min-h-screen">
      <Sidebar />
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-6 z-[100] flex items-center gap-sm px-lg py-md rounded-lg shadow-lg border animate-in slide-in-from-right duration-300 ${
          toast.type === "info"
            ? "bg-primary/10 border-primary/30 text-primary"
            : "bg-secondary-container border-secondary-container text-on-secondary-container"
        }`}>
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {toast.type === "info" ? "sync" : "check_circle"}
          </span>
          <span className="font-body-md">{toast.msg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-xl gap-md">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface">Dashboard</h1>
          <p className="font-body-md text-on-surface-variant">
            {MUMBAI_MAP_CONFIG.city} · {MUMBAI_MAP_CONFIG.date}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-md">
          <button
            onClick={handleDownloadReport}
            className="border border-outline text-on-surface px-lg py-sm rounded font-label-caps tracking-wider hover:bg-surface-container-high transition-colors active:scale-95 flex items-center gap-xs"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            DOWNLOAD REPORT
          </button>
          <button
            onClick={handleRegenerateRoutes}
            disabled={isRegenerating}
            className="bg-primary text-on-primary px-lg py-sm rounded font-label-caps tracking-wider hover:bg-primary-container transition-colors active:scale-95 shadow-sm flex items-center gap-xs disabled:opacity-60"
          >
            <span className={`material-symbols-outlined text-[18px] ${isRegenerating ? "animate-spin" : ""}`}>
              {isRegenerating ? "sync" : "alt_route"}
            </span>
            {isRegenerating ? "REGENERATING..." : "REGENERATE ROUTES"}
          </button>
        </div>
      </div>

      {/* Row 1 - KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        {dashboardKPIs.map((kpi) => (
          <div key={kpi.label} className="bg-surface border-standard p-md rounded-lg flex flex-col gap-sm">
            <p className="font-label-caps text-on-surface-variant tracking-wider">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <span className="font-metric-lg text-on-surface">{kpi.value}</span>
              {kpi.change && (
                <div className={`flex items-center gap-xs ${kpi.changeColor}`}>
                  <span className="material-symbols-outlined text-[16px]">{kpi.changeIcon}</span>
                  <span className="font-body-md font-medium">{kpi.change}</span>
                </div>
              )}
              {kpi.dots && (
                <div className="flex items-center gap-xs mb-2">
                  {kpi.dots.map((dot, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${dot.color}`}></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 - Map & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
        <div className="lg:col-span-7 bg-surface border-standard p-md rounded-lg flex flex-col">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-h2 text-on-surface">Live Fleet Map</h2>
            <span className="font-id-mono text-on-surface-variant text-id-mono">
              LOC: {MUMBAI_MAP_CONFIG.center.lat}° N, {MUMBAI_MAP_CONFIG.center.lng}° E
            </span>
          </div>
          <div className="flex-1 bg-inset rounded-lg aspect-video relative overflow-hidden border-standard flex items-center justify-center">
            <iframe 
              src={MUMBAI_MAP_CONFIG.embedUrl}
              className="absolute inset-0 w-full h-full border-0 pointer-events-auto dark:[filter:invert(0.9)_hue-rotate(180deg)] transition-all"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-20"></div>
            <div className="absolute bottom-md left-md z-30 flex gap-sm">
              <div className="bg-surface/90 dark:bg-[#111827]/90 backdrop-blur-sm p-sm rounded border-standard flex items-center gap-sm shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                <span className="font-label-caps text-on-surface tracking-wider">ACTIVE ROUTE</span>
              </div>
              <div className="bg-surface/90 dark:bg-[#111827]/90 backdrop-blur-sm p-sm rounded border-standard flex items-center gap-sm shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                <span className="font-label-caps text-on-surface tracking-wider">COMPLETED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-5 bg-surface border-standard p-md rounded-lg flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-md">
            <div className="flex items-center gap-sm">
              <h2 className="font-h2 text-on-surface">Activity</h2>
              <div className="flex items-center gap-xs px-2 py-0.5 rounded-full bg-secondary-container/50 border border-secondary-container">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                <span className="font-label-caps text-on-secondary-container tracking-wider text-[10px]">LIVE</span>
              </div>
            </div>
            <button className="font-label-caps text-primary hover:text-primary-container tracking-wider transition-colors">
              VIEW ALL
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pr-sm space-y-sm custom-scrollbar">
            {mockActivity.map((item) => (
              <div key={item.id} className={`bg-inset p-md rounded-r-lg border-l-4 flex items-start gap-md ${
                item.color === 'error' ? 'border-error' : 
                item.color === 'secondary' ? 'border-secondary' : 
                'border-orange-500'
              }`}>
                <div className={`${item.bgColor} p-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <span className={`material-symbols-outlined text-[20px] ${
                    item.color === 'error' ? 'text-on-error-container' : 
                    item.color === 'secondary' ? 'text-on-secondary-container' : 
                    'text-white'
                  }`}>{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-xs">
                    <h3 className="font-h2 text-[16px] text-on-surface truncate pr-2">{item.title}</h3>
                    <span className="font-id-mono text-on-surface-variant flex-shrink-0">{item.time}</span>
                  </div>
                  <p className="font-body-md text-on-surface-variant leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
