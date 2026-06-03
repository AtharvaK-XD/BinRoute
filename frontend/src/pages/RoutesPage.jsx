import { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  mockRoutes,
  routesKPIs,
  MUMBAI_MAP_CONFIG,
} from "../data/mockData";

export default function RoutesPage() {
  const [expandedRoute, setExpandedRoute] = useState(null);

  const toggleRoute = (id) => {
    setExpandedRoute(expandedRoute === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'text-primary bg-primary/10 border-primary';
      case 'completed': return 'text-secondary bg-secondary/10 border-secondary';
      case 'delayed': return 'text-error bg-error/10 border-error';
      default: return 'text-outline-variant bg-surface-container-high border-outline-variant';
    }
  };

  const getBorderColor = (colorCode) => {
    switch (colorCode) {
      case 'primary': return 'border-l-primary';
      case 'secondary': return 'border-l-secondary';
      case 'error': return 'border-l-error';
      case 'tertiary': return 'border-l-tertiary';
      default: return 'border-l-outline-variant';
    }
  };

  const getProgressBarColor = (colorCode) => {
    switch (colorCode) {
      case 'primary': return 'bg-primary';
      case 'secondary': return 'bg-secondary';
      case 'error': return 'bg-error';
      case 'tertiary': return 'bg-tertiary';
      default: return 'bg-outline-variant';
    }
  };

  return (
    <div className="pt-24 pb-lg px-lg xl:ml-64 min-h-screen">
      <Sidebar />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-xl gap-md">
        <h2 className="font-h1 text-h1 text-on-surface">Live Route Tracking</h2>
        <div className="flex flex-wrap items-center gap-sm w-full md:w-auto">
          <div className="bg-surface border-standard rounded flex items-center px-sm py-1 w-full sm:w-64">
            <span className="material-symbols-outlined text-outline-variant text-[20px] mr-2">search</span>
            <input type="text" placeholder="Search routes..." className="bg-transparent border-none outline-none font-body-sm w-full text-on-surface" />
          </div>
          <button className="bg-surface border-standard p-1.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>

      {/* KPI Row — driven by backend data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        {routesKPIs.map(kpi => (
          <div key={kpi.label} className="bg-surface-container-lowest border border-outline-variant p-md rounded-lg flex flex-col gap-sm">
            <span className="font-label-caps text-on-surface-variant tracking-wider">{kpi.label}</span>
            <span className="font-metric-lg text-on-surface">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Two-Column Main Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg relative">
        
        {/* Route List — driven by backend mockRoutes */}
        <div className="lg:col-span-5 space-y-sm">
          {mockRoutes.map(route => (
            <div 
              key={route.id} 
              className={`bg-surface border border-outline-variant rounded-lg p-md cursor-pointer hover:-translate-y-0.5 transition-transform shadow-sm ${getBorderColor(route.color)} border-l-4`}
              onClick={() => toggleRoute(route.id)}
            >
              <div className="flex justify-between items-start mb-md">
                <div className="flex gap-md items-center">
                  <span className="bg-primary-fixed dark:bg-primary-fixed-dim text-on-primary-fixed rounded px-sm py-xs font-id-mono">{route.id}</span>
                  <h3 className="font-h2 text-on-surface">{route.driver}</h3>
                </div>
                <div className={`px-2 py-0.5 rounded font-label-caps tracking-wider border ${getStatusColor(route.status)}`}>
                  {route.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <div className="flex items-center gap-md text-on-surface-variant mb-md">
                <div className="flex items-center gap-xs font-body-sm">
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  {route.vehicle}
                </div>
                <div className="flex items-center gap-xs font-body-sm">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  {route.stops} stops
                </div>
                <div className="flex items-center gap-xs font-body-sm">
                  <span className="material-symbols-outlined text-[16px]">route</span>
                  {route.km ?? '--'} km
                </div>
              </div>

              {route.status !== 'scheduled' && (
                <div className="flex items-center gap-sm">
                  <div className="flex-1 h-2 rounded-full bg-outline-variant overflow-hidden">
                    <div className={`h-full rounded-full ${getProgressBarColor(route.color)}`} style={{ width: `${route.progress}%` }}></div>
                  </div>
                  <span className="font-body-sm font-medium text-on-surface-variant w-8 text-right">{route.progress}%</span>
                </div>
              )}

              {/* Expanded Area — uses nextStops from backend data */}
              {expandedRoute === route.id && (
                <div className="mt-md pt-md border-t border-outline-variant animate-in slide-in-from-top-2 duration-200">
                  <h4 className="font-label-caps text-on-surface-variant tracking-wider mb-sm">NEXT STOPS</h4>
                  <div className="space-y-2 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-outline-variant pl-6">
                    {(route.nextStops || []).map((stop, i) => (
                      <div key={stop.binId} className="relative">
                        <div className={`absolute -left-6 w-3 h-3 rounded-full border-2 border-surface ${i === 0 ? getProgressBarColor(route.color) : 'bg-outline-variant'} mt-1`}></div>
                        <p className="font-id-mono text-on-surface">{stop.binId} <span className="font-body-sm text-on-surface-variant ml-2">{stop.zone}</span></p>
                      </div>
                    ))}
                    {(!route.nextStops || route.nextStops.length === 0) && (
                      <p className="font-body-sm text-on-surface-variant italic">No remaining stops</p>
                    )}
                  </div>

                  {/* Extra route details from backend */}
                  <div className="mt-md grid grid-cols-2 gap-sm">
                    <div className="flex flex-col">
                      <span className="font-label-caps text-on-surface-variant tracking-wider text-[10px]">ETA</span>
                      <span className="font-id-mono text-on-surface">{route.estimatedEnd}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-caps text-on-surface-variant tracking-wider text-[10px]">FUEL USED</span>
                      <span className="font-id-mono text-on-surface">{route.fuelUsed} L</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-caps text-on-surface-variant tracking-wider text-[10px]">STOPS DONE</span>
                      <span className="font-id-mono text-on-surface">{route.completedStops} / {route.stops}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Map Preview */}
        <div className="lg:col-span-7 relative h-[600px]">
          <div className="bg-surface border-standard rounded-lg h-full overflow-hidden relative flex flex-col p-md">
            <div className="flex-1 bg-inset rounded relative overflow-hidden flex items-center justify-center">
              {/* Google Map Background — from centralized config */}
              <iframe 
                src={MUMBAI_MAP_CONFIG.embedUrl}
                className="absolute inset-0 w-full h-full border-0 pointer-events-auto dark:[filter:invert(0.9)_hue-rotate(180deg)] transition-all"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              
              {/* SVG Route Overlays — repositioned onto Mumbai land (right-center of the map) */}
              <svg width="100%" height="100%" viewBox="0 0 800 550" className="absolute inset-0 z-10 pointer-events-none" preserveAspectRatio="xMidYMid meet">
                {/* Route R-001 (Primary / Blue) — Colaba → Dadar → Bandra */}
                <path d="M 420,420 C 430,380 440,340 435,300 C 430,260 425,230 430,200 C 435,170 440,140 450,110" fill="none" stroke="#004ac6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
                {/* R-001 stop dots */}
                <circle cx="420" cy="420" r="5" fill="#004ac6" stroke="white" strokeWidth="2" />
                <circle cx="435" cy="300" r="4" fill="#004ac6" stroke="white" strokeWidth="2" />
                <circle cx="430" cy="200" r="4" fill="#004ac6" stroke="white" strokeWidth="2" />
                <circle cx="450" cy="110" r="5" fill="#004ac6" stroke="white" strokeWidth="2" />
                {/* Truck icon on R-001 */}
                <circle cx="432" cy="250" r="8" fill="#004ac6" stroke="white" strokeWidth="2" />
                <text x="432" y="254" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">▶</text>

                {/* Route R-002 (Secondary / Green) — Worli → Lower Parel → Mahim */}
                <path d="M 390,380 C 400,350 420,320 440,290 C 460,260 480,240 500,210 C 520,180 530,160 540,140" fill="none" stroke="#006e2d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
                {/* R-002 stop dots */}
                <circle cx="390" cy="380" r="5" fill="#006e2d" stroke="white" strokeWidth="2" />
                <circle cx="440" cy="290" r="4" fill="#006e2d" stroke="white" strokeWidth="2" />
                <circle cx="500" cy="210" r="4" fill="#006e2d" stroke="white" strokeWidth="2" />
                <circle cx="540" cy="140" r="5" fill="#006e2d" stroke="white" strokeWidth="2" />

                {/* Route R-004 (Error / Red dashed) — Delayed route Sion → Kurla */}
                <path d="M 460,340 C 470,310 490,280 510,260 C 530,240 550,220 560,190" fill="none" stroke="#ba1a1a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10,8" opacity="0.85" />
                {/* R-004 stop dots */}
                <circle cx="460" cy="340" r="5" fill="#ba1a1a" stroke="white" strokeWidth="2" />
                <circle cx="510" cy="260" r="4" fill="#ba1a1a" stroke="white" strokeWidth="2" />
                <circle cx="560" cy="190" r="5" fill="#ba1a1a" stroke="white" strokeWidth="2" />

                {/* Zone labels on map */}
                <rect x="395" y="430" width="52" height="18" rx="4" fill="rgba(255,255,255,0.85)" />
                <text x="421" y="443" textAnchor="middle" fontSize="9" fill="#333" fontWeight="600">Colaba</text>
                
                <rect x="425" y="96" width="55" height="18" rx="4" fill="rgba(255,255,255,0.85)" />
                <text x="452" y="109" textAnchor="middle" fontSize="9" fill="#333" fontWeight="600">Bandra</text>

                <rect x="540" y="122" width="50" height="18" rx="4" fill="rgba(255,255,255,0.85)" />
                <text x="565" y="135" textAnchor="middle" fontSize="9" fill="#333" fontWeight="600">Mahim</text>
              </svg>

              {/* Legend */}
              <div className="absolute top-md right-md bg-surface/90 dark:bg-[#111827]/90 backdrop-blur-sm p-sm rounded border-standard z-20 flex flex-col gap-xs shadow-sm">
                <span className="font-label-caps text-on-surface-variant tracking-wider text-[10px] mb-0.5">ROUTES</span>
                <div className="flex items-center gap-xs"><div className="w-5 h-1 bg-primary rounded"></div><span className="font-body-sm text-on-surface">R-001 In Progress</span></div>
                <div className="flex items-center gap-xs"><div className="w-5 h-1 bg-secondary rounded"></div><span className="font-body-sm text-on-surface">R-002 Completed</span></div>
                <div className="flex items-center gap-xs"><div className="w-5 h-0.5 bg-error rounded border-t border-dashed border-error"></div><span className="font-body-sm text-on-surface">R-004 Delayed</span></div>
              </div>
            </div>
          </div>
          
          {/* FAB */}
          <button className="absolute bottom-6 right-6 bg-primary text-on-primary rounded-full w-14 h-14 shadow-lg flex items-center justify-center hover:bg-primary-container hover:scale-105 transition-all z-30 group">
            <span className="material-symbols-outlined text-[28px]">add</span>
            <div className="absolute right-16 bg-inverse-surface text-inverse-on-surface px-sm py-1 rounded font-body-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              ADD ROUTE
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
