import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useCivic } from '../context/CivicContext';
import { filterIssues } from '../utils/civicLogic';
import { IssueCategory, IssueSeverity, IssueStatus } from '../types/civic';
import { 
  Filter, 
  RotateCcw, 
  Flame, 
  Layers, 
  Search, 
  MapPin, 
  Info,
  Maximize2,
  SlidersHorizontal,
  X
} from 'lucide-react';

const CATEGORY_COLORS: Record<IssueCategory, string> = {
  roads: '#FFBF69',        // warm amber warning
  waste: '#38BDF8',        // sky blue
  lighting: '#9580FF',     // vivid violet
  water: '#42E8F5',        // electric cyan
  accessibility: '#FF6B78',// error / red indicator
  public_spaces: '#66E6B0',// mint green
};

const DEFAULT_CENTER: [number, number] = [37.7770, -122.4180];
const DEFAULT_ZOOM = 14;

export const LeafletCityMap: React.FC = () => {
  const { issues, selectIssue, activeIssueId, filters, setFilters, resetFilters } = useCivic();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatLayerRef = useRef<L.LayerGroup | null>(null);

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    // Standard OpenStreetMap tiles styled cleanly with dark CSS filter
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'dark-tiles',
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    const heatGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersGroup;
    heatLayerRef.current = heatGroup;

    // Invalidate size on mount after layout stabilizes
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Filtered issues synchronized with central context filters
  const filteredIssues = filterIssues(issues, filters);

  // Render Markers & Heat circles
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const heatGroup = heatLayerRef.current;
    if (!map || !markersGroup || !heatGroup) return;

    markersGroup.clearLayers();
    heatGroup.clearLayers();

    filteredIssues.forEach((issue) => {
      const color = CATEGORY_COLORS[issue.category] || '#42E8F5';
      const isSelected = activeIssueId === issue.id;

      // Heat circle if toggled
      if (showHeatmap) {
        const radius = issue.severity === 'critical' ? 240 : issue.severity === 'high' ? 180 : 120;
        const heatCircle = L.circle([issue.coordinates.lat, issue.coordinates.lng], {
          radius,
          color,
          fillColor: color,
          fillOpacity: 0.2,
          stroke: false,
        });
        heatGroup.addLayer(heatCircle);
      }

      // Custom pulsing HTML Pin Marker with interactive hover enlargement
      const pinHtml = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group" style="width: 36px; height: 36px;">
          ${isSelected ? `<div class="absolute inset-0 rounded-full animate-ping opacity-75" style="background-color: ${color};"></div>` : ''}
          <div class="absolute inset-0 rounded-full opacity-0 scale-75 group-hover:opacity-40 group-hover:scale-125 group-hover:civic-marker-pulse transition-all duration-300 pointer-events-none" style="background-color: ${color};"></div>
          <div class="relative w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 ease-out group-hover:scale-125 border-2 ${
            isSelected ? 'border-white scale-125 ring-2 ring-[#42E8F5]' : 'border-[#080D16]'
          }" style="background-color: ${color}; box-shadow: 0 0 12px ${color}66;">
            <div class="w-2.5 h-2.5 rounded-full bg-[#080D16] transition-transform duration-200 group-hover:scale-75"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'civic-marker-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([issue.coordinates.lat, issue.coordinates.lng], { icon: customIcon });

      const severityColor = issue.severity === 'critical' ? '#FF6B78' : issue.severity === 'high' ? '#FFBF69' : '#66E6B0';

      const tooltipContent = `
        <div class="p-2.5 max-w-[220px] text-xs font-sans space-y-1.5 pointer-events-none">
          <div class="flex items-center justify-between gap-2 text-[10px] font-mono border-b border-[rgba(160,190,220,0.15)] pb-1">
            <span style="color: ${color}; font-weight: 700;">${issue.id}</span>
            <span class="text-[#A6B4C8] uppercase font-semibold">${issue.category.replace(/_/g, ' ')}</span>
          </div>
          <div class="text-[12px] font-bold text-[#F4F7FC] leading-snug line-clamp-2">${issue.title}</div>
          <div class="flex items-center justify-between text-[10px] text-[#A6B4C8] pt-0.5">
            <span>${issue.neighborhood}</span>
            <span class="font-mono uppercase font-bold" style="color: ${severityColor};">${issue.severity}</span>
          </div>
          <div class="text-[9px] font-mono text-[#42E8F5] pt-0.5 flex items-center gap-1 border-t border-[rgba(160,190,220,0.1)]">
            <span class="w-1.5 h-1.5 rounded-full bg-[#42E8F5]"></span>
            <span>Click to inspect issue</span>
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: [0, -18],
        className: 'civic-map-tooltip',
        opacity: 1,
        sticky: false,
      });

      marker.on('click', () => {
        selectIssue(issue.id);
        map.panTo([issue.coordinates.lat, issue.coordinates.lng], { animate: true, duration: 0.5 });
      });

      markersGroup.addLayer(marker);
    });
  }, [filteredIssues, activeIssueId, showHeatmap, selectIssue]);

  const handleResetView = () => {
    mapInstanceRef.current?.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
    resetFilters();
  };

  const neighborhoods = ['all', 'Downtown Core', 'East Riverside', 'North Highlands', 'Arts District', 'Harbourfront', 'Oakridge'];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[#080D16]">
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-[#0C1320]/92 backdrop-blur-md p-2 rounded-xl border border-[rgba(160,190,220,0.14)] shadow-xl">
          {/* Search input */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#121C2B] border border-[rgba(160,190,220,0.14)] hover:border-[#42E8F5]/40 focus-within:border-[#42E8F5]/60 focus-within:shadow-[0_0_12px_rgba(66,232,245,0.15)] transition-all">
            <Search className="w-3.5 h-3.5 text-[#A6B4C8]" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
              placeholder="Filter location or defect..."
              className="bg-transparent text-xs text-[#F4F7FC] placeholder-[#A6B4C8] focus:outline-none w-36 sm:w-48"
              aria-label="Filter location or defect"
            />
            {filters.query && (
              <button onClick={() => setFilters((prev) => ({ ...prev, query: '' }))} className="text-[#A6B4C8] hover:text-[#42E8F5] transition-colors cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value as any }))}
            className="bg-[#121C2B] text-xs text-[#F4F7FC] border border-[rgba(160,190,220,0.14)] hover:border-[#42E8F5]/40 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#42E8F5]/60 focus:shadow-[0_0_12px_rgba(66,232,245,0.15)] transition-all cursor-pointer"
            aria-label="Filter by category"
          >
            <option value="all">All Categories ({issues.length})</option>
            <option value="roads">Roads & Potholes</option>
            <option value="waste">Sanitation & Waste</option>
            <option value="lighting">Streetlights & Lighting</option>
            <option value="water">Water & Drainage</option>
            <option value="accessibility">Accessibility & ADA</option>
            <option value="public_spaces">Public Spaces</option>
          </select>

          {/* Neighborhood Dropdown */}
          <select
            value={filters.neighborhood}
            onChange={(e) => setFilters((prev) => ({ ...prev, neighborhood: e.target.value }))}
            className="hidden sm:block bg-[#121C2B] text-xs text-[#F4F7FC] border border-[rgba(160,190,220,0.14)] hover:border-[#42E8F5]/40 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#42E8F5]/60 focus:shadow-[0_0_12px_rgba(66,232,245,0.15)] transition-all cursor-pointer"
            aria-label="Filter by neighborhood"
          >
            <option value="all">All Sectors</option>
            {neighborhoods.filter(n => n !== 'all').map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
              showHeatmap
                ? 'bg-[#FFBF69]/15 text-[#FFBF69] border-[#FFBF69] shadow-[0_0_12px_rgba(255,191,105,0.25)] font-bold'
                : 'bg-[#121C2B] text-[#A6B4C8] border-[rgba(160,190,220,0.14)] hover:text-[#F4F7FC] hover:border-[#FFBF69]/40 hover:bg-[#192638]'
            }`}
            aria-label="Toggle density heat map"
          >
            <Flame className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            <span className="hidden md:inline">Heat Density</span>
          </button>

          {/* Reset View */}
          <button
            onClick={handleResetView}
            className="p-1.5 rounded-lg bg-[#121C2B] text-[#A6B4C8] hover:text-[#42E8F5] border border-[rgba(160,190,220,0.14)] hover:border-[#42E8F5]/40 hover:bg-[#192638] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Reset to City Overview"
            aria-label="Reset city view"
          >
            <RotateCcw className="w-4 h-4 hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Right Status Badge */}
        <div className="hidden sm:flex items-center gap-2 pointer-events-auto bg-[#0C1320]/92 backdrop-blur-md px-3 py-2 rounded-xl border border-[rgba(160,190,220,0.14)] shadow-xl text-xs font-mono">
          <span className="text-[#42E8F5] font-bold">{filteredIssues.length}</span>
          <span className="text-[#A6B4C8]">PINS ACTIVE</span>
          <span className="text-slate-600">·</span>
          <span className="text-[#66E6B0]">COORDS LOCKED</span>
        </div>
      </div>

      {/* Floating Empty State when no pins match filters */}
      {filteredIssues.length === 0 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto bg-[#0C1320]/95 backdrop-blur-md border border-[#FFBF69]/40 rounded-xl p-4 shadow-2xl flex items-center gap-4 text-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="w-8 h-8 rounded-full bg-[#FFBF69]/15 border border-[#FFBF69]/30 flex items-center justify-center text-[#FFBF69] shrink-0">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#F4F7FC]">No reports match current filters</p>
            <p className="text-[11px] text-[#A6B4C8]">Try selecting a different municipal sector or defect category.</p>
          </div>
          <button
            onClick={handleResetView}
            className="px-3 py-1.5 rounded-lg bg-[#42E8F5] text-[#080D16] font-bold font-mono text-[11px] hover:glow-cyan-sm transition-all shrink-0 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Map Canvas */}
      <div 
        ref={mapContainerRef} 
        className="w-full flex-1 z-10"
        aria-label="Interactive city incident map" 
      />

      {/* Bottom Floating Legend */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 z-20 pointer-events-auto bg-[#0C1320]/94 backdrop-blur-md border border-[rgba(160,190,220,0.14)] rounded-xl p-3.5 shadow-2xl max-w-xs text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(160,190,220,0.14)]">
            <span className="font-mono text-[11px] font-bold text-[#F4F7FC] uppercase tracking-wider">
              Issue Classification
            </span>
            <button
              onClick={() => setShowLegend(false)}
              className="text-[#A6B4C8] hover:text-[#F4F7FC] p-0.5"
              aria-label="Hide legend"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.roads }} />
              <span className="text-[#A6B4C8]">Roads</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.waste }} />
              <span className="text-[#A6B4C8]">Waste</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.lighting }} />
              <span className="text-[#A6B4C8]">Lighting</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.water }} />
              <span className="text-[#A6B4C8]">Water</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.accessibility }} />
              <span className="text-[#A6B4C8]">Accessibility</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.public_spaces }} />
              <span className="text-[#A6B4C8]">Public Spaces</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State Overlay */}
      {filteredIssues.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/60 pointer-events-none">
          <div className="pointer-events-auto bg-[#121C2B] border border-[rgba(160,190,220,0.18)] rounded-xl p-6 text-center max-w-sm shadow-2xl">
            <Info className="w-8 h-8 text-[#FFBF69] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-[#F4F7FC]">No Issues Matched Filters</h4>
            <p className="text-xs text-[#A6B4C8] mt-1">
              Adjust your category, neighborhood, or search term to display incidents.
            </p>
            <button
              onClick={handleResetView}
              className="mt-4 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#080D16] bg-[#42E8F5] hover:bg-[#5CF0FD] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
