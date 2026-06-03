import { useState, useEffect } from "react";
import {
  settingsDefaults,
  SETTINGS_NAV_SECTIONS,
  NOTIFICATION_ALERTS,
  mockVehicles,
  mockZones as initialZones,
  systemOverview,
} from "../data/mockData";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("General");
  const [collectionThreshold, setCollectionThreshold] = useState(settingsDefaults.collectionThreshold);
  const [toggles, setToggles] = useState({ ...settingsDefaults.toggles });

  // Theme state — reads from localStorage + DOM
  const [themeChoice, setThemeChoice] = useState(() => localStorage.getItem("theme") || "dark");

  // Zone state
  const [zones, setZones] = useState(initialZones);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [newZone, setNewZone] = useState({ name: "", bins: "", area: "", collector: "" });
  const [editingZone, setEditingZone] = useState(null);

  // Apply theme whenever themeChoice changes
  useEffect(() => {
    const isDark = themeChoice === "dark" || (themeChoice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", themeChoice === "system" ? (isDark ? "dark" : "light") : themeChoice);
  }, [themeChoice]);

  const handleToggle = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  const DAY_LABELS = ['M','T','W','T','F','S','S'];

  // Zone CRUD
  const openCreateZone = () => {
    setNewZone({ name: "", bins: "", area: "", collector: "" });
    setEditingZone(null);
    setShowZoneModal(true);
  };
  const openEditZone = (zone) => {
    setNewZone({ name: zone.name, bins: String(zone.bins), area: zone.area, collector: zone.collector });
    setEditingZone(zone.name);
    setShowZoneModal(true);
  };
  const saveZone = () => {
    if (!newZone.name.trim()) return;
    const zoneObj = { name: newZone.name.trim(), bins: Number(newZone.bins) || 0, area: newZone.area.trim() || "—", collector: newZone.collector.trim() || "Unassigned" };
    if (editingZone) {
      setZones(prev => prev.map(z => z.name === editingZone ? zoneObj : z));
    } else {
      setZones(prev => [...prev, zoneObj]);
    }
    setShowZoneModal(false);
  };
  const deleteZone = (name) => setZones(prev => prev.filter(z => z.name !== name));

  const renderTabContent = () => {
    switch(activeTab) {

      case "Appearance":
        return (
          <>
            <div className="flex items-center gap-sm mb-lg">
              <div className="bg-secondary-container text-on-secondary-container p-sm rounded flex items-center justify-center">
                <span className="material-symbols-outlined">palette</span>
              </div>
              <h2 className="font-h2 text-on-surface">Appearance Settings</h2>
            </div>

            {/* Theme cards */}
            <p className="font-body-sm text-on-surface-variant mb-md">Choose your preferred theme</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-xl">
              {[
                { value: "light", icon: "light_mode", label: "Light", desc: "Bright interface" },
                { value: "dark", icon: "dark_mode", label: "Dark", desc: "Easy on the eyes" },
                { value: "system", icon: "contrast", label: "System", desc: "Match OS setting" },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setThemeChoice(opt.value)}
                  className={`p-lg rounded-lg border-2 flex flex-col items-center gap-sm transition-all text-center ${
                    themeChoice === opt.value
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-high"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    themeChoice === opt.value ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"
                  }`}>
                    <span className="material-symbols-outlined text-[28px]">{opt.icon}</span>
                  </div>
                  <span className="font-body-md font-bold text-on-surface">{opt.label}</span>
                  <span className="text-xs text-on-surface-variant">{opt.desc}</span>
                  {themeChoice === opt.value && (
                    <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-xs mb-xl">
              <label className="font-body-sm text-on-surface-variant">Density</label>
              <select className="bg-surface-container-low border border-outline-variant rounded px-md py-sm font-body-md text-on-surface focus:ring-2 focus:ring-primary outline-none">
                <option>Comfortable (Default)</option>
                <option>Compact</option>
              </select>
            </div>
          </>
        );

      case "Notifications":
        return (
          <>
            <div className="flex items-center gap-sm mb-lg">
              <div className="bg-secondary-container text-on-secondary-container p-sm rounded flex items-center justify-center">
                <span className="material-symbols-outlined">notifications</span>
              </div>
              <h2 className="font-h2 text-on-surface">Alerts & Notifications</h2>
            </div>
            <div className="space-y-md mb-xl">
              {NOTIFICATION_ALERTS.map(alert => (
                <div key={alert} className="flex items-center justify-between border-b border-outline-variant pb-sm">
                  <span className="font-body-md text-on-surface">{alert}</span>
                  <div className="flex gap-md">
                    <label className="flex items-center gap-xs cursor-pointer"><input type="checkbox" defaultChecked className="accent-primary" /> <span className="text-xs text-on-surface-variant">Email</span></label>
                    <label className="flex items-center gap-xs cursor-pointer"><input type="checkbox" className="accent-primary" /> <span className="text-xs text-on-surface-variant">SMS</span></label>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-auto">
              <button className="bg-primary text-on-primary px-xl py-sm rounded font-label-caps tracking-wider hover:bg-primary-container transition-colors active:scale-95 shadow-sm">UPDATE PREFERENCES</button>
            </div>
          </>
        );

      case "Fleet Management":
        return (
          <>
            <div className="flex items-center gap-sm mb-lg">
              <div className="bg-secondary-container text-on-secondary-container p-sm rounded flex items-center justify-center">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <h2 className="font-h2 text-on-surface">Fleet Roster</h2>
            </div>
            <div className="mb-md flex justify-end">
              <button className="border border-primary text-primary px-md py-xs rounded font-label-caps tracking-wider hover:bg-primary-container transition-colors">+ ADD VEHICLE</button>
            </div>
            <div className="overflow-x-auto border border-outline-variant rounded-lg mb-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b border-outline-variant">
                    <th className="p-sm font-label-caps text-on-surface-variant">ID</th>
                    <th className="p-sm font-label-caps text-on-surface-variant">Type</th>
                    <th className="p-sm font-label-caps text-on-surface-variant">Driver</th>
                    <th className="p-sm font-label-caps text-on-surface-variant">Status</th>
                    <th className="p-sm font-label-caps text-on-surface-variant">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockVehicles.map((v) => (
                    <tr key={v.id} className="border-b border-outline-variant last:border-none">
                      <td className="p-sm font-id-mono text-on-surface">{v.id}</td>
                      <td className="p-sm text-on-surface font-body-sm">{v.type}</td>
                      <td className="p-sm text-on-surface font-body-sm">{v.driver}</td>
                      <td className="p-sm"><span className="bg-secondary/20 text-secondary px-2 py-0.5 rounded text-xs capitalize">{v.status}</span></td>
                      <td className="p-sm"><button className="text-primary hover:underline text-sm">Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case "Zone Configuration":
        return (
          <>
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-sm">
                <div className="bg-secondary-container text-on-secondary-container p-sm rounded flex items-center justify-center">
                  <span className="material-symbols-outlined">map</span>
                </div>
                <h2 className="font-h2 text-on-surface">Operating Zones</h2>
              </div>
              <button onClick={openCreateZone} className="bg-primary text-on-primary px-md py-xs rounded font-label-caps tracking-wider hover:bg-primary-container transition-colors active:scale-95 flex items-center gap-xs shadow-sm">
                <span className="material-symbols-outlined text-[18px]">add</span> NEW ZONE
              </button>
            </div>

            {zones.length === 0 && (
              <div className="text-center py-xl text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] mb-md block opacity-40">map</span>
                <p className="font-body-md">No zones configured yet. Create your first zone above.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mb-xl">
              {zones.map((zone) => (
                <div key={zone.name} className="border border-outline-variant p-md rounded-lg flex flex-col gap-sm hover:border-primary transition-colors group relative">
                  <div className="flex items-start justify-between">
                    <h4 className="font-body-md font-bold text-on-surface">{zone.name}</h4>
                    <div className="flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditZone(zone)} className="text-primary hover:bg-primary/10 p-1 rounded" title="Edit">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => deleteZone(zone.name)} className="text-error hover:bg-error/10 p-1 rounded" title="Delete">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                  <span className="text-xs text-on-surface-variant">{zone.bins} Assigned Bins · {zone.area}</span>
                  <span className="text-xs text-on-surface-variant">Collector: {zone.collector}</span>
                </div>
              ))}
            </div>

            {/* Zone Modal */}
            {showZoneModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowZoneModal(false)}>
                <div className="bg-surface border border-outline-variant rounded-xl p-lg w-full max-w-md shadow-xl mx-md animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-lg">
                    <h3 className="font-h2 text-on-surface">{editingZone ? "Edit Zone" : "Create New Zone"}</h3>
                    <button onClick={() => setShowZoneModal(false)} className="text-on-surface-variant hover:text-on-surface">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="space-y-md mb-lg">
                    <div className="flex flex-col gap-xs">
                      <label className="font-body-sm text-on-surface-variant">Zone Name *</label>
                      <input type="text" value={newZone.name} onChange={e => setNewZone(p => ({...p, name: e.target.value}))} placeholder="e.g. Downtown Core" className="bg-surface-container-low border border-outline-variant rounded px-md py-sm font-body-md text-on-surface focus:ring-2 focus:ring-primary outline-none" autoFocus />
                    </div>
                    <div className="grid grid-cols-2 gap-md">
                      <div className="flex flex-col gap-xs">
                        <label className="font-body-sm text-on-surface-variant">Assigned Bins</label>
                        <input type="number" value={newZone.bins} onChange={e => setNewZone(p => ({...p, bins: e.target.value}))} placeholder="0" className="bg-surface-container-low border border-outline-variant rounded px-md py-sm font-body-md text-on-surface focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                      <div className="flex flex-col gap-xs">
                        <label className="font-body-sm text-on-surface-variant">Area</label>
                        <input type="text" value={newZone.area} onChange={e => setNewZone(p => ({...p, area: e.target.value}))} placeholder="e.g. 15.3 km²" className="bg-surface-container-low border border-outline-variant rounded px-md py-sm font-body-md text-on-surface focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="font-body-sm text-on-surface-variant">Assigned Collector Vehicle</label>
                      <select value={newZone.collector} onChange={e => setNewZone(p => ({...p, collector: e.target.value}))} className="bg-surface-container-low border border-outline-variant rounded px-md py-sm font-body-md text-on-surface focus:ring-2 focus:ring-primary outline-none">
                        <option value="">Select vehicle...</option>
                        {mockVehicles.map(v => <option key={v.id} value={v.id}>{v.id} — {v.driver}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-sm justify-end">
                    <button onClick={() => setShowZoneModal(false)} className="border border-outline-variant text-on-surface px-lg py-sm rounded font-label-caps tracking-wider hover:bg-surface-container-high transition-colors">CANCEL</button>
                    <button onClick={saveZone} disabled={!newZone.name.trim()} className="bg-primary text-on-primary px-lg py-sm rounded font-label-caps tracking-wider hover:bg-primary-container transition-colors active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                      {editingZone ? "SAVE CHANGES" : "CREATE ZONE"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case "Schedule":
        return (
          <>
            <div className="flex items-center gap-sm mb-lg">
              <div className="bg-secondary-container text-on-secondary-container p-sm rounded flex items-center justify-center">
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <h2 className="font-h2 text-on-surface">Scheduling Defaults</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-xl">
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm text-on-surface-variant">Shift Start Time</label>
                <input type="time" defaultValue={settingsDefaults.shiftStart} className="bg-surface-container-low border border-outline-variant rounded px-md py-sm font-body-md text-on-surface focus:ring-2 focus:ring-primary outline-none [color-scheme:light] dark:[color-scheme:dark]" />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm text-on-surface-variant">Shift End Time</label>
                <input type="time" defaultValue={settingsDefaults.shiftEnd} className="bg-surface-container-low border border-outline-variant rounded px-md py-sm font-body-md text-on-surface focus:ring-2 focus:ring-primary outline-none [color-scheme:light] dark:[color-scheme:dark]" />
              </div>
              <div className="flex flex-col gap-xs md:col-span-2">
                <label className="font-body-sm text-on-surface-variant">Active Days</label>
                <div className="flex flex-wrap gap-sm">
                  {DAY_LABELS.map((day, i) => (
                    <div key={i} className={`w-10 h-10 rounded flex items-center justify-center font-bold cursor-pointer ${settingsDefaults.activeDays[i] ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>{day}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-auto">
              <button className="bg-primary text-on-primary px-xl py-sm rounded font-label-caps tracking-wider hover:bg-primary-container active:scale-95 shadow-sm">SAVE SCHEDULE</button>
            </div>
          </>
        );

      case "General":
      default:
        return (
          <>
            <div className="flex items-center gap-sm mb-lg">
              <div className="bg-secondary-container text-on-secondary-container p-sm rounded flex items-center justify-center">
                <span className="material-symbols-outlined">settings_suggest</span>
              </div>
              <h2 className="font-h2 text-on-surface">General Configuration</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-xl">
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm text-on-surface-variant">Platform Name</label>
                <input type="text" defaultValue={settingsDefaults.platformName} className="bg-surface-container-low border border-outline-variant rounded px-md py-sm font-body-md text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm text-on-surface-variant">City Jurisdiction</label>
                <input type="text" defaultValue={settingsDefaults.cityJurisdiction} className="bg-surface-container-low border border-outline-variant rounded px-md py-sm font-body-md text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-xs">
                <div className="flex justify-between items-center">
                  <label className="font-body-sm text-on-surface-variant">Collection Threshold (%)</label>
                  <span className="font-id-mono text-on-surface">{collectionThreshold}</span>
                </div>
                <input type="range" min="0" max="100" value={collectionThreshold} onChange={e => setCollectionThreshold(Number(e.target.value))} className="w-full accent-primary mt-2" />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm text-on-surface-variant">Max Stops Per Vehicle</label>
                <input type="number" defaultValue={settingsDefaults.maxStopsPerVehicle} className="bg-surface-container-low border border-outline-variant rounded px-md py-sm font-body-md text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
            </div>
            <hr className="border-outline-variant mb-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
              {[
                { key: 'aiRoute', label: 'Enable AI Route Optimization' },
                { key: 'dynamicRerouting', label: 'Allow Dynamic Re-routing' },
                { key: 'dailyReport', label: 'Send Daily Report Email' },
                { key: 'realtimeSync', label: 'Real-time Bin Sensor Sync' }
              ].map((toggle) => (
                <div key={toggle.key} className="flex items-center justify-between">
                  <span className="font-body-md text-on-surface">{toggle.label}</span>
                  <button type="button" onClick={() => handleToggle(toggle.key)} className={`w-12 h-6 rounded-full p-1 flex transition-colors ${toggles[toggle.key] ? 'bg-primary justify-end' : 'bg-outline-variant justify-start'}`}>
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform"></div>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-auto">
              <button className="bg-primary text-on-primary px-xl py-sm rounded font-label-caps tracking-wider hover:bg-primary-container transition-colors active:scale-95 shadow-sm">SAVE CHANGES</button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="pt-16 min-h-screen flex bg-background">
      <aside className="w-64 bg-surface-container-low dark:bg-surface-dim border-r border-outline-variant fixed bottom-0 top-16 hidden lg:flex flex-col z-10 transition-colors">
        <div className="p-md border-b border-outline-variant flex gap-sm items-center">
          <div className="bg-primary text-on-primary rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined">location_city</span>
          </div>
          <div>
            <h2 className="font-h2 text-on-surface leading-tight">Municipal Ops</h2>
            <p className="font-body-sm text-on-surface-variant">District 4 - Metro</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-md space-y-md custom-scrollbar">
          {SETTINGS_NAV_SECTIONS.map(section => (
            <div key={section.title}>
              <h3 className="font-label-caps text-on-surface-variant mb-xs tracking-wider px-sm">{section.title}</h3>
              <div className="space-y-1">
                {section.items.map(item => (
                  <button key={item} onClick={() => setActiveTab(item)} className={`w-full text-left px-sm py-2 rounded-lg font-body-md transition-colors ${activeTab === item ? "bg-secondary-container text-on-secondary-container dark:bg-secondary-container/80 font-medium" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="p-md border-t border-outline-variant">
          <span className="font-id-mono text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded">{systemOverview.version}</span>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 p-lg pt-8 xl:p-xl max-w-7xl mx-auto w-full">
        <h1 className="font-h1 text-h1 text-on-surface mb-lg">Settings</h1>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg items-start">
          <div className="xl:col-span-8 bg-surface border border-outline-variant rounded-lg p-md lg:p-lg flex flex-col min-h-[500px]">
            {renderTabContent()}
          </div>
          <div className="xl:col-span-4 bg-surface-container-low border border-outline-variant rounded-lg p-md flex flex-col gap-md">
            <h3 className="font-label-caps text-on-surface-variant tracking-wider">SYSTEM OVERVIEW</h3>
            <div className="space-y-sm bg-surface p-md rounded border border-outline-variant">
              {[
                ["Total Bins", systemOverview.totalBins],
                ["Active Vehicles", systemOverview.activeVehicles],
                ["Zones Configured", zones.length],
              ].map(([label, val], i) => (
                <div key={label} className={`flex justify-between items-center ${i < 2 ? "border-b border-outline-variant pb-xs" : ""}`}>
                  <span className="font-body-md text-on-surface-variant">{label}</span>
                  <span className="font-id-mono text-on-surface font-bold">{val}</span>
                </div>
              ))}
              <div className="flex justify-between items-center border-t border-outline-variant pt-xs">
                <span className="font-body-md text-on-surface-variant">Last Sync</span>
                <div className="flex items-center gap-xs">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="font-body-sm text-secondary">{systemOverview.lastSync}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-inset rounded border border-outline-variant h-48 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#434655 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              <span className="material-symbols-outlined text-outline-variant text-[48px] opacity-50 z-10">hub</span>
              <div className="absolute inset-0 z-20 opacity-30">
                <svg width="100%" height="100%">
                  <circle cx="30%" cy="30%" r="4" fill="#004ac6" />
                  <circle cx="70%" cy="40%" r="4" fill="#004ac6" />
                  <circle cx="50%" cy="80%" r="4" fill="#004ac6" />
                  <line x1="30%" y1="30%" x2="70%" y2="40%" stroke="#004ac6" strokeWidth="2" />
                  <line x1="70%" y1="40%" x2="50%" y2="80%" stroke="#004ac6" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
