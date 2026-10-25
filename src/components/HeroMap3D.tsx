import React, { useState, useRef } from 'react';
import { useCivic } from '../context/CivicContext';
import { ArrowRight, Plus, MapPin, Compass, ChevronDown, Sparkles } from 'lucide-react';
import { GlowButton } from './GlowButton';
import { CursorSpotlight } from './CursorSpotlight';

export const HeroMap3D: React.FC = () => {
  const { issues, setActiveTab, selectIssue, setTourOpen } = useCivic();
  const [activePinIndex, setActivePinIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Top representative hero issues
  const heroIssues = issues.slice(0, 4);
  const activeIssue = heroIssues[activePinIndex] || heroIssues[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const scrollToTelemetry = () => {
    const el = document.getElementById('city-pulse-telemetry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden py-12 lg:py-16 bg-[#080D16] bg-grid-pattern border-b border-[rgba(160,190,220,0.14)]"
      aria-label="CivicLens Introduction"
    >
      {/* Background ambient cursor spotlight */}
      <CursorSpotlight size={700} intensity={0.09} />

      {/* Cinematic ambient atmospheric light glows */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#42E8F5]/10 rounded-full blur-[120px] animate-pulse" 
        style={{ animationDuration: '8s' }} 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-[#9580FF]/10 rounded-full blur-[120px] animate-pulse" 
        style={{ animationDuration: '10s' }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Column: Hero Narrative */}
        <div className="lg:col-span-6 space-y-6 z-10">
          
          {/* Animated Status Pill & Guided Walkthrough Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0C1320]/90 backdrop-blur-md border border-[#42E8F5]/30 text-xs font-mono text-[#42E8F5] shadow-lg shadow-[#42E8F5]/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#42E8F5] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#42E8F5]" />
              </span>
              <span className="tracking-wider">CIVIC INTELLIGENCE / SYSTEM ONLINE</span>
            </div>

            <button
              onClick={() => setTourOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#9580FF]/15 border border-[#9580FF]/40 text-xs font-mono text-[#9580FF] hover:bg-[#9580FF]/25 hover:border-[#9580FF] hover:shadow-[0_0_12px_rgba(149,128,255,0.3)] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9580FF]" />
              <span>JUDGE & REVIEWER TOUR</span>
            </button>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F7FC] leading-[1.08] text-balance">
              See the problem.{' '}
              <span className="bg-gradient-to-r from-[#42E8F5] via-[#6CA0FF] to-[#9580FF] bg-clip-text text-transparent">
                Make change visible.
              </span>
            </h1>
            <p className="text-sm sm:text-base font-mono text-[#42E8F5]/90 tracking-wide uppercase">
              Your city has a story. Make it impossible to ignore.
            </p>
          </div>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#A6B4C8] max-w-xl font-normal leading-relaxed">
            Turn broken pavements, unlit crosswalks, drainage leaks, and transit barriers into clear, trackable civic intelligence. Discover patterns, verify neighbor reports, and follow progress transparently.
          </p>

          {/* Action CTAs with Cursor-Following Glow */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => setActiveTab('map')}
              icon={<Compass className="w-5 h-5 stroke-[2.5]" />}
            >
              Explore the City
            </GlowButton>

            <GlowButton
              variant="secondary"
              size="lg"
              onClick={() => setActiveTab('report')}
              icon={<Plus className="w-5 h-5 text-[#42E8F5]" />}
            >
              Report an Issue
            </GlowButton>

            <GlowButton
              variant="ghost"
              size="lg"
              onClick={() => setTourOpen(true)}
              icon={<Sparkles className="w-4 h-4 text-[#9580FF]" />}
            >
              Guided Walkthrough
            </GlowButton>
          </div>

          {/* Dataset Status Proof Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-[#A6B4C8] border-t border-[rgba(160,190,220,0.14)]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#42E8F5] font-bold text-sm">{issues.length}</span>
              <span>DEMO REPORTS INDEXED</span>
            </div>
            <span className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#66E6B0] font-bold text-sm">
                {issues.filter(i => i.status === 'resolved').length}
              </span>
              <span>RESOLVED RECORDED</span>
            </div>
            <span className="text-slate-600">·</span>
            <span className="text-[#A6B4C8]/70 text-[11px]">METROPOLITAN RADAR v2.4</span>
          </div>
        </div>

        {/* Right Column: Interactive 3D Urban Cartography */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="lg:col-span-6 relative perspective-[1200px]"
        >
          {/* Main 3D Cartography Canvas Container */}
          <div 
            className="relative w-full aspect-[4/3] rounded-2xl bg-[#0C1320] border border-[rgba(160,190,220,0.16)] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(66,232,245,0.12)] overflow-hidden transition-transform duration-200 ease-out"
            style={{
              transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Fine Grid Background & Contours */}
            <svg 
              className="absolute inset-0 w-full h-full opacity-70" 
              viewBox="0 0 600 450" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="roadGlow" x1="0" y1="0" x2="600" y2="450" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#42E8F5" stopOpacity="0.85" />
                  <stop offset="0.5" stopColor="#9580FF" stopOpacity="0.75" />
                  <stop offset="1" stopColor="#38BDF8" stopOpacity="0.45" />
                </linearGradient>
                <linearGradient id="meshGrad" x1="0" y1="0" x2="600" y2="450" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#42E8F5" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#9580FF" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Metropolitan Road Grid Arterials */}
              <path d="M 0 120 Q 200 130 350 200 T 600 240" stroke="url(#roadGlow)" strokeWidth="3" />
              <path d="M 0 320 Q 250 280 400 310 T 600 360" stroke="#192638" strokeWidth="2.5" />
              <path d="M 180 0 L 160 450" stroke="rgba(160,190,220,0.12)" strokeWidth="2" strokeDasharray="6 6" />
              <path d="M 320 0 L 340 450" stroke="url(#roadGlow)" strokeWidth="2.5" opacity="0.65" />
              <path d="M 480 0 L 460 450" stroke="rgba(160,190,220,0.12)" strokeWidth="2" strokeDasharray="6 6" />

              {/* Connected Radar Constellation Lines */}
              <line x1="168" y1="202" x2="348" y2="198" stroke="url(#meshGrad)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="348" y1="198" x2="432" y2="126" stroke="url(#meshGrad)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="168" y1="202" x2="252" y2="306" stroke="url(#meshGrad)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="252" y1="306" x2="348" y2="198" stroke="url(#meshGrad)" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Diagonal Transit Arterial with animated flow */}
              <path 
                d="M 50 420 L 520 80" 
                stroke="#42E8F5" 
                strokeWidth="2" 
                strokeDasharray="12 8" 
                className="animate-[dash_20s_linear_infinite]"
              />

              {/* Stylized Building Silhouettes with layered surface contrast */}
              <rect x="80" y="160" width="45" height="70" rx="3" fill="#121C2B" stroke="rgba(160,190,220,0.14)" strokeWidth="1.5" />
              <rect x="135" y="140" width="60" height="90" rx="3" fill="#192638" stroke="rgba(160,190,220,0.14)" strokeWidth="1.5" />
              <rect x="230" y="70" width="70" height="110" rx="3" fill="#121C2B" stroke="rgba(160,190,220,0.14)" strokeWidth="1.5" />
              <rect x="390" y="110" width="55" height="85" rx="3" fill="#192638" stroke="rgba(160,190,220,0.14)" strokeWidth="1.5" />
              <rect x="460" y="150" width="75" height="100" rx="3" fill="#121C2B" stroke="rgba(160,190,220,0.14)" strokeWidth="1.5" />
              <rect x="260" y="270" width="65" height="75" rx="3" fill="#192638" stroke="rgba(160,190,220,0.14)" strokeWidth="1.5" />
              <rect x="360" y="290" width="80" height="60" rx="3" fill="#121C2B" stroke="rgba(160,190,220,0.14)" strokeWidth="1.5" />

              {/* Radiant Pulse Rings around active sector */}
              <circle cx="340" cy="200" r="40" stroke="#42E8F5" strokeWidth="1" strokeDasharray="4 4" opacity="0.45" />
              <circle cx="340" cy="200" r="70" stroke="#9580FF" strokeWidth="1" opacity="0.25" />
            </svg>

            {/* Glowing Interactive Issue Nodes */}
            {[
              { x: '28%', y: '45%', idx: 0, color: '#FFBF69', label: 'Roads' },
              { x: '58%', y: '44%', idx: 1, color: '#66E6B0', label: 'Resolved' },
              { x: '72%', y: '28%', idx: 2, color: '#9580FF', label: 'Lighting' },
              { x: '42%', y: '68%', idx: 3, color: '#42E8F5', label: 'Water' },
            ].map((node) => {
              const isSelected = activePinIndex === node.idx;
              const issue = heroIssues[node.idx];
              if (!issue) return null;
              return (
                <button
                  key={node.idx}
                  onClick={() => setActivePinIndex(node.idx)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20 cursor-pointer"
                  style={{ left: node.x, top: node.y }}
                  aria-label={`Select issue ${issue.id}`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Outer Pulsing Aura */}
                    <span 
                      className="absolute w-8 h-8 rounded-full opacity-60 animate-ping"
                      style={{ backgroundColor: node.color }}
                    />
                    {/* Center Glowing Pin */}
                    <div 
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg transition-all ${
                        isSelected 
                          ? 'scale-125 border-white shadow-[0_0_18px_rgba(66,232,245,0.9)]' 
                          : 'border-[#080D16] group-hover:scale-110'
                      }`}
                      style={{ backgroundColor: node.color }}
                    >
                      <div className="w-2 h-2 rounded-full bg-[#080D16]" />
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Floating Miniature Information HUD Card */}
            {activeIssue && (
              <div 
                className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-[#080D16]/95 backdrop-blur-md border border-[rgba(160,190,220,0.2)] rounded-xl p-3.5 shadow-2xl z-30 transition-all duration-300"
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-[#42E8F5] font-bold">{activeIssue.id}</span>
                  <span className="text-[#A6B4C8] capitalize">{activeIssue.category}</span>
                </div>
                <h4 className="text-xs font-bold text-[#F4F7FC] line-clamp-1">
                  {activeIssue.title}
                </h4>
                <p className="text-[11px] text-[#A6B4C8] line-clamp-1 mt-0.5">
                  {activeIssue.locationName}
                </p>

                <div className="mt-2.5 pt-2 border-t border-[rgba(160,190,220,0.14)] flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-[#66E6B0] uppercase font-semibold">
                    {activeIssue.status.replace(/_/g, ' ')}
                  </span>
                  <button
                    onClick={() => {
                      selectIssue(activeIssue.id);
                      setActiveTab('map');
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#42E8F5] hover:underline"
                  >
                    <span>View on Map</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Corner Coordinate HUD Watermark */}
            <div className="absolute top-3 right-3 text-[10px] font-mono text-[#A6B4C8] bg-[#080D16]/85 px-2.5 py-1 rounded border border-[rgba(160,190,220,0.16)] pointer-events-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#42E8F5] animate-pulse" />
              <span>GRID SECTOR: 37.77°N 122.41°W</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Cue Indicator */}
      <div className="mt-8 sm:mt-12 flex justify-center relative z-10">
        <button
          onClick={scrollToTelemetry}
          className="group flex flex-col items-center gap-1.5 text-xs font-mono text-[#A6B4C8] hover:text-[#42E8F5] transition-colors focus:outline-none"
          aria-label="Scroll to City Pulse Telemetry"
        >
          <span className="text-[10px] tracking-widest uppercase">Explore City Pulse</span>
          <div className="w-5 h-8 rounded-full border border-[rgba(160,190,220,0.25)] group-hover:border-[#42E8F5] flex items-start justify-center p-1 transition-colors">
            <span className="w-1 h-2 rounded-full bg-[#42E8F5] animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
