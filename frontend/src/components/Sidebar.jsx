import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  mockBins,
  mockRoutes,
  mockVehicles,
  mockZones,
} from "../data/mockData";

function exportAllData() {
  const date = new Date().toISOString().split("T")[0];
  let csv = "=== BINROUTE DATA EXPORT ===\n";
  csv += `Generated: ${new Date().toLocaleString()}\n\n`;

  // Bins
  csv += "--- BINS ---\n";
  csv += "ID,Zone,Fill %,Status,Lat,Lng,Last Reading,Battery %\n";
  mockBins.forEach(b => csv += `${b.id},${b.zone},${b.fill},${b.status},${b.lat},${b.lng},${b.lastReading},${b.sensorBattery}\n`);

  // Routes
  csv += "\n--- ROUTES ---\n";
  csv += "ID,Driver,Vehicle,Status,Stops,Progress\n";
  mockRoutes.forEach(r => csv += `${r.id},${r.driver},${r.vehicle},${r.status},${r.stops},${r.progress || "—"}\n`);

  // Vehicles
  csv += "\n--- VEHICLES ---\n";
  csv += "ID,Type,Driver,Status\n";
  mockVehicles.forEach(v => csv += `${v.id},${v.type},${v.driver},${v.status}\n`);

  // Zones
  csv += "\n--- ZONES ---\n";
  csv += "Name,Bins,Area,Collector\n";
  mockZones.forEach(z => csv += `${z.name},${z.bins},${z.area},${z.collector}\n`);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `BinRoute_FullExport_${date}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export default function Sidebar() {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    exportAllData();
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const navItems = [
    { label: "Dashboard", icon: "dashboard", path: "/dashboard" },
    { label: "Live Map", icon: "map", path: "/map" },
    { label: "Routes", icon: "route", path: "/routes" },
    { label: "Analytics", icon: "query_stats", path: "/analytics" },
    { label: "Settings", icon: "settings", path: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-surface-container-low dark:bg-surface-dim border-r border-outline-variant flex flex-col transition-colors duration-200 z-40 hidden xl:flex">
      <div className="p-md border-b border-outline-variant">
        <h2 className="font-h2 text-h2 text-on-surface">Municipal Ops</h2>
        <p className="font-body-sm text-on-surface-variant">District 4 - Metro</p>
      </div>

      <div className="flex-1 overflow-y-auto p-sm space-y-xs custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-md px-md py-sm rounded-lg font-body-md transition-colors active:scale-95 ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container dark:bg-secondary-container dark:text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high"
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-md border-t border-outline-variant">
        <button
          onClick={handleExport}
          className={`w-full py-sm rounded-lg font-label-caps tracking-wider transition-all active:scale-95 shadow-sm flex items-center justify-center gap-xs ${
            exported
              ? "bg-secondary text-on-secondary"
              : "bg-primary text-on-primary hover:bg-primary-container"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" style={exported ? { fontVariationSettings: "'FILL' 1" } : {}}>
            {exported ? "check_circle" : "download"}
          </span>
          {exported ? "EXPORTED!" : "EXPORT DATA"}
        </button>
      </div>
    </aside>
  );
}
