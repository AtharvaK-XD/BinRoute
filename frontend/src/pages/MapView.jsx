import { useEffect, useRef, useState } from "react";
import {
  mockBins,
  mockVehicles,
  VEHICLE_STATUS_MAP,
  MAP_ZONE_LABELS,
  MUMBAI_MAP_CONFIG,
} from "../data/mockData";

const MAP_WIDTH = 1280;
const MAP_HEIGHT = 900;
const INITIAL_PAN = { x: 0, y: 0 };
const INITIAL_ZOOM = 1;
const MANUAL_BINS_STORAGE_KEY = "binroute:manual-bins";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getBinMarkerClassName = (status) => {
  switch (status) {
    case "critical":
      return "bg-error";
    case "warning":
      return "bg-orange-500";
    default:
      return "bg-secondary";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "critical":
      return "Critical";
    case "warning":
      return "Warning";
    default:
      return "Optimal";
  }
};

// Place bins within the center of the map canvas so they appear on land
const normalizeBin = (bin, index) => ({
  ...bin,
  x: bin.x ?? 400 + (index % 3) * 140,
  y: bin.y ?? 280 + Math.floor(index / 3) * 120,
});

const getStoredManualBins = () => {
  try {
    const savedBins = JSON.parse(localStorage.getItem(MANUAL_BINS_STORAGE_KEY) ?? "[]");
    return Array.isArray(savedBins) ? savedBins.map(normalizeBin) : [];
  } catch {
    return [];
  }
};

// Build vehicle sidebar items from centralized vehicle data
const vehicleSidebarItems = mockVehicles.map((v) => {
  const statusInfo = VEHICLE_STATUS_MAP[v.status] || VEHICLE_STATUS_MAP.standby;
  return [
    `#${v.id}`,
    statusInfo.label,
    statusInfo.indicator,
  ];
});

export default function MapView() {
  const [bins, setBins] = useState(() => [...mockBins.map(normalizeBin), ...getStoredManualBins()]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [isPinMode, setIsPinMode] = useState(false);
  const [mapStyle, setMapStyle] = useState("map");
  const [pan, setPan] = useState(INITIAL_PAN);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [isDragging, setIsDragging] = useState(false);

  // Filter state — all checked by default
  const [filters, setFilters] = useState({
    critical: true,
    warning: true,
    ok: true,
  });
  const [zoneFilters, setZoneFilters] = useState({
    "Central Business": true,
    "Riverside North": true,
    "Industrial West": false,
    "Residential South": false,
  });

  const mapRef = useRef(null);
  const dragRef = useRef(null);
  const wasDraggingRef = useRef(false);

  // Derive visible bins from filters
  const visibleBins = bins.filter((bin) => {
    const statusKey = bin.status === "ok" ? "ok" : bin.status;
    if (!filters[statusKey]) return false;
    // Zone filter — only filter bins whose zone matches a known zone key; manual/other bins always show
    const knownZones = Object.keys(zoneFilters);
    const matchedZone = knownZones.find((z) => bin.zone.includes(z));
    if (matchedZone && !zoneFilters[matchedZone]) return false;
    return true;
  });

  const criticalBins = visibleBins.filter((bin) => bin.status === "critical");
  const manualBins = bins.filter((bin) => bin.isManual);

  useEffect(() => {
    localStorage.setItem(MANUAL_BINS_STORAGE_KEY, JSON.stringify(bins.filter((bin) => bin.isManual)));
  }, [bins]);

  const getMapPoint = (event) => {
    const rect = mapRef.current.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left - pan.x) / zoom,
      y: (event.clientY - rect.top - pan.y) / zoom,
    };
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0 || event.target.closest("button, input, a, label")) return;

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current) return;

    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      dragRef.current.moved = true;
    }

    setPan({
      x: dragRef.current.panX + deltaX,
      y: dragRef.current.panY + deltaY,
    });
  };

  const handlePointerUp = (event) => {
    if (!dragRef.current) return;

    wasDraggingRef.current = dragRef.current.moved;
    dragRef.current = null;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleMapClick = (event) => {
    if (wasDraggingRef.current) {
      wasDraggingRef.current = false;
      return;
    }
    if (!isPinMode) return;

    const point = getMapPoint(event);
    const x = clamp(point.x, 60, MAP_WIDTH - 60);
    const y = clamp(point.y, 60, MAP_HEIGHT - 60);
    const newBin = {
      id: `BN-${5000 + bins.length + 1}`,
      zone: "Manual Pin",
      lat: Number((18.91 + y / 5200).toFixed(4)),
      lng: Number((72.8 + x / 9000).toFixed(4)),
      fill: 0,
      status: "ok",
      x,
      y,
      isManual: true,
    };

    setBins((currentBins) => [...currentBins, newBin]);
    setSelectedBin(newBin);
    setIsPinMode(false);
  };

  // Zoom via +/- buttons
  const handleZoom = (amount) => {
    setZoom((currentZoom) => clamp(Number((currentZoom + amount).toFixed(2)), 0.5, 2.5));
  };

  // Scroll-wheel zoom — zoom toward cursor position
  const handleWheel = (event) => {
    event.preventDefault();
    const rect = mapRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = clamp(Number((zoom + delta).toFixed(2)), 0.5, 2.5);
    const scale = newZoom / zoom;

    setPan({
      x: mouseX - (mouseX - pan.x) * scale,
      y: mouseY - (mouseY - pan.y) * scale,
    });
    setZoom(newZoom);
  };

  // Attach non-passive wheel listener
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  });

  const removeSelectedManualBin = () => {
    if (!selectedBin?.isManual) return;

    setBins((currentBins) => currentBins.filter((bin) => bin.id !== selectedBin.id));
    setSelectedBin(null);
  };

  return (
    <div className="pt-16 h-screen w-full overflow-hidden flex bg-background">
      <aside className="w-80 bg-surface-container-low dark:bg-surface-dim border-r border-outline-variant flex flex-col z-10 transition-colors hidden md:flex">
        <div className="p-md border-b border-outline-variant flex gap-sm items-center">
          <div className="bg-primary text-on-primary rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined">location_city</span>
          </div>
          <div>
            <h2 className="font-h2 text-on-surface leading-tight">Municipal Ops</h2>
            <p className="font-body-sm text-on-surface-variant">District 4 - Metro</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-md space-y-lg custom-scrollbar">
          <div className="bg-surface-container-lowest dark:bg-[#1A2235] border border-outline-variant rounded-lg flex items-center px-sm py-2">
            <span className="material-symbols-outlined text-outline ml-1 mr-2 text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search Bin ID or Street..."
              className="bg-transparent border-none outline-none font-body-sm w-full text-on-surface placeholder:text-outline"
            />
          </div>

          {/* FILL LEVEL FILTERS — functional */}
          <div>
            <h3 className="font-label-caps text-on-surface-variant mb-sm tracking-wider">FILL LEVEL</h3>
            <div className="space-y-sm">
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.critical}
                  onChange={() => setFilters((f) => ({ ...f, critical: !f.critical }))}
                  className="accent-error w-4 h-4 rounded"
                />
                <span className="font-body-md text-on-surface">Critical ({">"}85%)</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.warning}
                  onChange={() => setFilters((f) => ({ ...f, warning: !f.warning }))}
                  className="accent-orange-500 w-4 h-4 rounded"
                />
                <span className="font-body-md text-on-surface">Warning (60-85%)</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.ok}
                  onChange={() => setFilters((f) => ({ ...f, ok: !f.ok }))}
                  className="accent-secondary w-4 h-4 rounded"
                />
                <span className="font-body-md text-on-surface">Optimal ({"<"}60%)</span>
              </label>
            </div>
          </div>

          {/* ZONE FILTERS — functional */}
          <div>
            <h3 className="font-label-caps text-on-surface-variant mb-sm tracking-wider">ZONE SELECTION</h3>
            <div className="space-y-sm">
              {Object.entries(zoneFilters).map(([zone, checked]) => (
                <label key={zone} className="flex items-center gap-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setZoneFilters((z) => ({ ...z, [zone]: !z[zone] }))}
                    className="accent-primary w-4 h-4 rounded"
                  />
                  <div className={`w-2.5 h-2.5 rounded-full ${checked ? 'bg-primary' : 'border-2 border-outline-variant'} flex-shrink-0`}></div>
                  <span className="font-body-md text-on-surface">{zone}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Active vehicles — driven by backend mockVehicles */}
          <div>
            <h3 className="font-label-caps text-on-surface-variant mb-sm tracking-wider">ACTIVE VEHICLES</h3>
            <div className="space-y-xs">
              {vehicleSidebarItems.map(([truck, label, indicator]) => (
                <div key={truck} className="flex items-center gap-sm py-xs">
                  <div className={`w-2.5 h-2.5 rounded-full ${indicator}`}></div>
                  <span className="font-id-mono text-on-surface">{truck}</span>
                  <span className="font-body-sm text-on-surface-variant text-xs truncate">- {label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-label-caps text-on-surface-variant mb-sm tracking-wider">CRITICAL BINS</h3>
            <div className="space-y-sm">
              {criticalBins.map((bin) => (
                <button
                  key={bin.id}
                  type="button"
                  className="w-full text-left bg-surface border-standard rounded p-sm cursor-pointer hover:bg-surface-container-high transition-colors"
                  onClick={() => setSelectedBin(bin)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-id-mono text-on-surface">{bin.id}</span>
                    <span className="font-body-sm font-bold text-error">{bin.fill}%</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant text-xs">
                    <span className="truncate">{bin.zone}</span>
                    <span>{bin.lastReading || "12m ago"}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {manualBins.length > 0 && (
            <div>
              <h3 className="font-label-caps text-on-surface-variant mb-sm tracking-wider">MANUAL PINS</h3>
              <div className="space-y-sm">
                {manualBins.map((bin) => (
                  <button
                    key={bin.id}
                    type="button"
                    className="w-full text-left bg-surface border-standard rounded p-sm hover:bg-surface-container-high transition-colors"
                    onClick={() => setSelectedBin(bin)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-id-mono text-on-surface">{bin.id}</span>
                      <span className="font-body-sm text-secondary">Pinned</span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant">{bin.lat}, {bin.lng}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-md border-t border-outline-variant">
          <div className="flex items-center justify-between mb-xs">
            <span className="font-body-sm text-on-surface-variant">{visibleBins.length} / {bins.length} bins shown</span>
          </div>
        </div>
      </aside>

      <div
        ref={mapRef}
        role="application"
        aria-label="Interactive bin map"
        className={`flex-1 bg-inset relative overflow-hidden border-l border-outline-variant touch-none select-none ${
          isPinMode ? "cursor-crosshair" : isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleMapClick}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {/* Google Map Background — pointer-events-none so custom drag moves pins + map together */}
          <iframe 
            src={MUMBAI_MAP_CONFIG.embedUrl}
            className="absolute border-0 pointer-events-none dark:[filter:invert(0.9)_hue-rotate(180deg)] transition-all"
            style={{ top: '-50%', left: '-50%', width: '200%', height: '200%' }}
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          {/* Zone labels from backend data */}
          {MAP_ZONE_LABELS.map(([label, x, y]) => (
            <div
              key={label}
              className="absolute rounded bg-white/70 dark:bg-[#111827]/75 px-sm py-xs font-label-caps text-on-surface-variant shadow-sm backdrop-blur-sm pointer-events-none"
              style={{ left: x, top: y }}
            >
              {label}
            </div>
          ))}

          {/* Bin markers — only rendered if they pass the filter */}
          {visibleBins.map((bin) => (
            <button
              key={bin.id}
              type="button"
              aria-label={`Open ${bin.id} details`}
              className={`absolute w-7 h-7 rounded-full border-2 border-white shadow-md flex items-center justify-center hover:scale-125 transition-transform z-10 ${getBinMarkerClassName(bin.status)}`}
              style={{ left: bin.x, top: bin.y, transform: "translate(-50%, -50%)" }}
              onClick={(event) => {
                event.stopPropagation();
                setSelectedBin(bin);
              }}
            >
              {bin.status === "critical" && <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>}
              {bin.isManual && <span className="material-symbols-outlined text-white text-[16px]">add_location</span>}
            </button>
          ))}
        </div>

        {/* HUD — top left */}
        <div className="absolute top-md left-md z-30 flex flex-col gap-xs">
          <div className="bg-surface/95 dark:bg-[#111827]/95 backdrop-blur-sm rounded-lg border-standard p-sm shadow-sm flex items-center gap-sm">
            <span className="font-body-sm font-medium text-on-surface">{visibleBins.length} Bins Visible</span>
            <span className="font-body-sm text-on-surface-variant">× {zoom.toFixed(1)}x</span>
            {isPinMode && <span className="font-label-caps text-primary dark:text-inverse-primary tracking-wider">PIN MODE</span>}
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsPinMode((current) => !current);
            }}
            className={`self-start px-md py-sm rounded-lg border-standard font-label-caps tracking-wider shadow-sm transition-colors ${
              isPinMode
                ? "bg-secondary text-on-secondary"
                : "bg-surface/95 dark:bg-[#111827]/95 text-on-surface hover:bg-surface-container-high"
            }`}
          >
            {isPinMode ? "PLACE BIN" : "ADD BIN"}
          </button>
        </div>

        {/* HUD — zoom buttons (top right) */}
        <div className="absolute top-md right-md z-30 flex flex-col gap-xs">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={(event) => {
              event.stopPropagation();
              handleZoom(0.15);
            }}
            className="bg-surface/95 dark:bg-[#111827]/95 backdrop-blur-sm border-standard w-10 h-10 rounded-t-lg flex items-center justify-center text-on-surface-variant hover:bg-surface hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={(event) => {
              event.stopPropagation();
              handleZoom(-0.15);
            }}
            className="bg-surface/95 dark:bg-[#111827]/95 backdrop-blur-sm border-standard border-t-0 w-10 h-10 rounded-b-lg flex items-center justify-center text-on-surface-variant hover:bg-surface hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>

        {/* HUD — map style toggle (bottom right) */}
        <div className="absolute bottom-md right-md z-30">
          <div className="bg-surface/95 dark:bg-[#111827]/95 backdrop-blur-sm rounded-full border-standard p-1 shadow-sm flex items-center">
            {["map", "satellite"].map((style) => (
              <button
                key={style}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setMapStyle(style);
                }}
                className={`px-md py-1 rounded-full font-body-sm transition-colors ${
                  mapStyle === style
                    ? "bg-surface-container-high dark:bg-surface-dim font-medium text-on-surface"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {style === "map" ? "Map" : "Satellite"}
              </button>
            ))}
          </div>
        </div>

        {/* Bin detail popup */}
        {selectedBin && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface border-standard rounded-xl p-md shadow-lg w-72 z-50 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-sm">
              <span className="font-id-mono bg-surface-container-high px-2 py-1 rounded text-on-surface">{selectedBin.id}</span>
              <button type="button" onClick={() => setSelectedBin(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <h3 className="font-h2 text-on-surface mb-xs">{selectedBin.zone}</h3>
            <p className="font-body-sm text-on-surface-variant">{getStatusLabel(selectedBin.status)} bin at {selectedBin.lat}, {selectedBin.lng}</p>

            <div className="mt-md mb-md">
              <div className="flex justify-between text-body-sm mb-1">
                <span className="text-on-surface-variant">Fill Level</span>
                <span className={`font-bold ${selectedBin.fill > 85 ? "text-error" : "text-secondary"}`}>{selectedBin.fill}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-variant overflow-hidden">
                <div
                  className={`h-full rounded-full ${selectedBin.fill > 85 ? "bg-error" : "bg-secondary"}`}
                  style={{ width: `${selectedBin.fill}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-xs text-on-surface-variant text-xs mb-lg">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>{selectedBin.isManual ? "Placed manually" : `Last reading: ${selectedBin.lastReading || "12 min ago"}`}</span>
            </div>

            <div className="flex gap-sm">
              {selectedBin.isManual ? (
                <button
                  type="button"
                  onClick={removeSelectedManualBin}
                  className="flex-1 border border-outline-variant text-error py-2 rounded font-label-caps tracking-wider hover:bg-surface-container-high transition-colors"
                >
                  REMOVE
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedBin(null)}
                  className="flex-1 border border-outline-variant text-on-surface py-2 rounded font-label-caps tracking-wider hover:bg-surface-container-high transition-colors"
                >
                  CLOSE
                </button>
              )}
              <button type="button" className="flex-1 bg-primary text-on-primary py-2 rounded font-label-caps tracking-wider hover:bg-primary-container transition-colors">
                DISPATCH
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
