import React from 'react';
import { useCivic } from '../context/CivicContext';
import { HeroMap3D } from './HeroMap3D';
import { calculateCityMetrics } from '../utils/civicLogic';
import { GlowButton } from './GlowButton';
import { GlowCard } from './GlowCard';
import { CursorSpotlight } from './CursorSpotlight';
import { 
  ArrowRight, 
  MapPin, 
  Plus, 
  Activity, 
  Radar, 
  CheckCircle2, 
  Eye,
  Camera,
  Sparkles
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { issues, openDetail, setActiveTab } = useCivic();
  const metrics = calculateCityMetrics(issues);

  // Priority issues to feature (first 4)
  const priorityIssues = issues.slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      
      {/* SECTION A: Cinematic Hero Experience */}
      <HeroMap3D />

      {/* SECTION B: City Pulse Metrics */}
      <section 
        id="city-pulse-telemetry" 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24" 
        aria-label="City Pulse"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(160,190,220,0.14)] mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#42E8F5]" />
            <h2 className="text-xs font-mono font-bold text-[#F4F7FC] uppercase tracking-wider">
              City Pulse / Telemetry
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#FFBF69] bg-[#FFBF69]/10 px-2.5 py-0.5 rounded border border-[#FFBF69]/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFBF69] animate-pulse" />
            <span>DEMO DATA AUDIT</span>
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlowCard tilt={true} glowColor="cyan" className="p-5">
            <span className="text-[11px] font-mono text-[#A6B4C8] block uppercase">Total Demo Reports</span>
            <span className="text-3xl font-extrabold text-[#F4F7FC] font-mono tabular-nums block mt-1">
              {metrics.totalReports}
            </span>
            <span className="text-xs text-[#A6B4C8] mt-1 block">Live indexed incident nodes</span>
          </GlowCard>

          <GlowCard tilt={true} glowColor="multi" className="p-5">
            <span className="text-[11px] font-mono text-[#A6B4C8] block uppercase">Awaiting Verification</span>
            <span className="text-3xl font-extrabold text-[#FFBF69] font-mono tabular-nums block mt-1">
              {metrics.awaitingVerification}
            </span>
            <span className="text-xs text-[#A6B4C8] mt-1 block">Pending community review</span>
          </GlowCard>

          <GlowCard tilt={true} glowColor="cyan" className="p-5">
            <span className="text-[11px] font-mono text-[#A6B4C8] block uppercase">Recorded Resolutions</span>
            <span className="text-3xl font-extrabold text-[#66E6B0] font-mono tabular-nums block mt-1">
              {metrics.resolvedCount}
            </span>
            <span className="text-xs text-[#A6B4C8] mt-1 block">Surface repairs verified</span>
          </GlowCard>

          <GlowCard tilt={true} glowColor="violet" className="p-5">
            <span className="text-[11px] font-mono text-[#A6B4C8] block uppercase">Dominant Category</span>
            <span className="text-2xl font-extrabold text-[#42E8F5] font-mono capitalize block mt-1 truncate">
              {metrics.mostReportedCategory}
            </span>
            <span className="text-xs text-[#A6B4C8] mt-1 block">Highest reporting frequency</span>
          </GlowCard>
        </div>
      </section>

      {/* SECTION C: Priority Issues Editorial Grid with Interactive Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" aria-label="Priority Civic Issues">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[rgba(160,190,220,0.14)]">
          <div>
            <span className="text-xs font-mono font-bold text-[#42E8F5] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Priority Issues</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F7FC] mt-1">
              High-Attention Neighborhood Hazards
            </h2>
          </div>
          <GlowButton
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('map')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            iconPosition="right"
          >
            View All On City Map
          </GlowButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {priorityIssues.map((issue) => (
            <GlowCard
              key={issue.id}
              tilt={true}
              glowColor="cyan"
              className="flex flex-col overflow-hidden group shadow-lg"
            >
              <div className="aspect-[4/3] bg-[#080D16] relative overflow-hidden">
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#080D16]/90 backdrop-blur-sm text-[10px] font-mono font-bold text-[#FFBF69] border border-[#FFBF69]/40 uppercase shadow">
                  {issue.severity}
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#080D16]/90 backdrop-blur-sm text-[10px] font-mono text-[#66E6B0] border border-[#66E6B0]/40 font-semibold shadow">
                  {issue.status.replace(/_/g, ' ')}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#A6B4C8]">
                    <span className="text-[#42E8F5] font-semibold">{issue.id}</span>
                    <span>·</span>
                    <span className="capitalize">{issue.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#F4F7FC] group-hover:text-[#42E8F5] transition-colors line-clamp-2 leading-snug">
                    {issue.title}
                  </h3>
                  <p className="text-[11px] text-[#A6B4C8] line-clamp-1">
                    {issue.locationName}
                  </p>
                </div>

                {/* Extra information revealed on hover */}
                <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-300 ease-out overflow-hidden space-y-1 text-[10px] font-mono text-[#A6B4C8] bg-[#0C1320]/80 p-0 group-hover:p-2 rounded-lg border border-transparent group-hover:border-[rgba(160,190,220,0.12)]">
                  <div className="flex items-center justify-between">
                    <span>Audit Stage:</span>
                    <span className="text-[#42E8F5] font-semibold">{issue.timeline[issue.timeline.length - 1]?.label || 'Submitted'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sector:</span>
                    <span className="text-[#F4F7FC]">{issue.neighborhood}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[rgba(160,190,220,0.14)] flex items-center justify-between text-xs">
                  <span className="text-[#A6B4C8] font-mono text-[11px]">
                    {issue.supports} supporters
                  </span>
                  <GlowButton
                    variant="outline"
                    size="sm"
                    onClick={() => openDetail(issue.id)}
                    icon={<ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />}
                    iconPosition="right"
                    className="group-hover:border-[#42E8F5] group-hover:text-[#42E8F5] group-hover:shadow-[0_0_12px_rgba(66,232,245,0.25)]"
                  >
                    Inspect
                  </GlowButton>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* SECTION D: How CIVICLENS Works (4-Step Visual Sequence) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-label="Platform Methodology">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-bold text-[#42E8F5] uppercase tracking-wider">
            Operational Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F7FC]">
            How CIVICLENS Operates
          </h2>
          <p className="text-xs sm:text-sm text-[#A6B4C8]">
            A transparent four-stage progression that converts visual complaints into verified community intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Discover a Problem',
              desc: 'Encounter road potholes, waste accumulation, unlit crosswalks, or accessibility barriers in your neighborhood.',
              icon: Eye,
            },
            {
              step: '02',
              title: 'Capture & AI Scan',
              desc: 'Photograph the defect. Computer vision classifies category, estimates depth/severity, and drafts clear descriptions.',
              icon: Camera,
            },
            {
              step: '03',
              title: 'Duplicate Radar',
              desc: 'Haversine distance algorithms check nearby reports within 600m to eliminate duplicates and build consensus.',
              icon: Radar,
            },
            {
              step: '04',
              title: 'Track Visible Outcomes',
              desc: 'Audit the complete chronological resolution timeline with before-and-after photo verification.',
              icon: CheckCircle2,
            },
          ].map((item) => (
            <GlowCard
              key={item.step}
              tilt={true}
              glowColor="cyan"
              className="p-6 space-y-4 relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0C1320] border border-[rgba(160,190,220,0.14)] flex items-center justify-center text-[#42E8F5] shadow-[0_0_15px_rgba(66,232,245,0.15)]">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-[#9580FF] block">
                PHASE {item.step}
              </span>
              <h3 className="text-base font-bold text-[#F4F7FC]">{item.title}</h3>
              <p className="text-xs text-[#A6B4C8] leading-relaxed">{item.desc}</p>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* SECTION E: Community Impact Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Impact Scope">
        <div className="relative p-8 rounded-3xl bg-gradient-to-r from-[#0C1320] to-[#121C2B] border border-[rgba(160,190,220,0.18)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden shadow-2xl">
          <CursorSpotlight size={500} intensity={0.06} />

          <div className="lg:col-span-8 space-y-4 relative z-10">
            <span className="text-xs font-mono font-bold text-[#66E6B0] uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#66E6B0]" />
              <span>DATA HONESTY & CIVIC TRANSPARENCY</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F7FC]">
              Data That Clarifies, Not Disinforms
            </h2>
            <p className="text-xs sm:text-sm text-[#A6B4C8] leading-relaxed">
              CIVICLENS distinguishes itself by refusing to fabricate claims of municipal response times or fake city council endorsements. Every report represents authentic citizen documentation, verified through local peer consensus and geospatial analysis.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end relative z-10">
            <GlowButton
              variant="secondary"
              size="md"
              onClick={() => setActiveTab('impact')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Explore Full Analytics
            </GlowButton>
          </div>
        </div>
      </section>

      {/* SECTION F: Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 relative" aria-label="Call to Action">
        <CursorSpotlight size={550} intensity={0.07} />

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F7FC] tracking-tight">
            Better cities begin with being noticed.
          </h2>
          <p className="text-sm text-[#A6B4C8]">
            Join neighbors in turning everyday infrastructure defects into clear, trackable, and verifiable civic change.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => setActiveTab('report')}
              icon={<Plus className="w-5 h-5 stroke-[2.5]" />}
            >
              Report a Problem
            </GlowButton>

            <GlowButton
              variant="secondary"
              size="lg"
              onClick={() => setActiveTab('map')}
              icon={<MapPin className="w-5 h-5 text-[#42E8F5]" />}
            >
              Explore the Map
            </GlowButton>
          </div>
        </div>
      </section>
    </div>
  );
};
