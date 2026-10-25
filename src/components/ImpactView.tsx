import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { calculateCityMetrics, detectHiddenPatterns } from '../utils/civicLogic';
import { HiddenPattern, IssueCategory } from '../types/civic';
import { 
  Activity, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  ArrowRight,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { GlowCard } from './GlowCard';
import { GlowButton } from './GlowButton';

export const ImpactView: React.FC = () => {
  const { issues, openDetail, setActiveTab, setFilters } = useCivic();
  const metrics = calculateCityMetrics(issues);
  const patterns = detectHiddenPatterns(issues);

  const [selectedPattern, setSelectedPattern] = useState<HiddenPattern | null>(patterns[0] || null);

  const categoryEntries = Object.entries(metrics.categoryBreakdown) as [IssueCategory, number][];
  const maxCategoryCount = Math.max(...categoryEntries.map(([, count]) => count), 1);

  const neighborhoodEntries = Object.entries(metrics.neighborhoodBreakdown);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      
      {/* Page Title Header */}
      <div className="space-y-3 pb-6 border-b border-[rgba(160,190,220,0.14)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#42E8F5]/10 border border-[#42E8F5]/30 text-xs font-mono text-[#42E8F5]">
          <Activity className="w-3.5 h-3.5" />
          <span>CIVIC INTELLIGENCE ANALYTICS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F4F7FC] tracking-tight">
          City Infrastructure Insights & Impact
        </h1>
        <p className="text-sm text-[#A6B4C8] max-w-2xl">
          Aggregated infrastructure health metrics derived dynamically from verified resident reports. Click any metric, category, or sector to filter and inspect directly on the City Map.
        </p>
      </div>

      {/* Top 4 KPI Cards - Connected to Map and Community Filters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('map')}
          className="cursor-pointer"
          title="Filter all reports on City Map"
        >
          <GlowCard tilt={true} glowColor="cyan" className="p-5 space-y-2 group hover:border-[#42E8F5]/50 transition-all">
            <span className="text-[11px] font-mono text-[#A6B4C8] block uppercase">Total Verified Reports</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#F4F7FC] group-hover:text-[#42E8F5] group-hover:drop-shadow-[0_0_12px_rgba(66,232,245,0.6)] transition-all duration-300 font-mono tabular-nums">{metrics.totalReports}</span>
              <span className="text-xs text-[#42E8F5] font-mono font-semibold">100% AUDITED</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#A6B4C8]">
              <span>Across 6 municipal sectors</span>
              <span className="text-[10px] text-[#42E8F5] opacity-0 group-hover:opacity-100 transition-opacity">Map ↗</span>
            </div>
          </GlowCard>
        </div>

        <div
          onClick={() => {
            setFilters((prev) => ({ ...prev, status: 'resolved' }));
            setActiveTab('map');
          }}
          className="cursor-pointer"
          title="Filter resolved reports on City Map"
        >
          <GlowCard tilt={true} glowColor="cyan" className="p-5 space-y-2 group hover:border-[#66E6B0]/50 transition-all">
            <span className="text-[11px] font-mono text-[#A6B4C8] block uppercase">Resolution Rate</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#66E6B0] group-hover:drop-shadow-[0_0_12px_rgba(102,230,176,0.6)] transition-all duration-300 font-mono tabular-nums">{metrics.resolutionRatePercent}%</span>
              <span className="text-xs text-[#A6B4C8] font-mono font-semibold">CONFIRMED</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#A6B4C8]">
              <span>{metrics.resolvedCount} issues marked resolved</span>
              <span className="text-[10px] text-[#66E6B0] opacity-0 group-hover:opacity-100 transition-opacity">Filter ↗</span>
            </div>
          </GlowCard>
        </div>

        <div
          onClick={() => {
            setFilters((prev) => ({ ...prev, status: 'awaiting_verification' }));
            setActiveTab('map');
          }}
          className="cursor-pointer"
          title="Filter awaiting verification on City Map"
        >
          <GlowCard tilt={true} glowColor="multi" className="p-5 space-y-2 group hover:border-[#FFBF69]/50 transition-all">
            <span className="text-[11px] font-mono text-[#A6B4C8] block uppercase">In Active Review</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#FFBF69] group-hover:drop-shadow-[0_0_12px_rgba(255,191,105,0.6)] transition-all duration-300 font-mono tabular-nums">{metrics.awaitingVerification}</span>
              <span className="text-xs text-[#A6B4C8] font-mono font-semibold">PENDING</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#A6B4C8]">
              <span>Community verification stage</span>
              <span className="text-[10px] text-[#FFBF69] opacity-0 group-hover:opacity-100 transition-opacity">Review ↗</span>
            </div>
          </GlowCard>
        </div>

        <div
          onClick={() => setActiveTab('community')}
          className="cursor-pointer"
          title="View community endorsements and discussions"
        >
          <GlowCard tilt={true} glowColor="violet" className="p-5 space-y-2 group hover:border-[#9580FF]/50 transition-all">
            <span className="text-[11px] font-mono text-[#A6B4C8] block uppercase">Community Endorsements</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#9580FF] group-hover:drop-shadow-[0_0_12px_rgba(149,128,255,0.6)] transition-all duration-300 font-mono tabular-nums">{metrics.totalCommunitySupports}</span>
              <span className="text-xs text-[#A6B4C8] font-mono font-semibold">CITIZEN VOTES</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#A6B4C8]">
              <span>Neighborhood verification signals</span>
              <span className="text-[10px] text-[#9580FF] opacity-0 group-hover:opacity-100 transition-opacity">Community ↗</span>
            </div>
          </GlowCard>
        </div>
      </div>

      {/* Signature Narrative Feature: "The City's Hidden Patterns" */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0C1320] via-[#121C2B] to-[#152338] border border-[#42E8F5]/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(160,190,220,0.14)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#42E8F5] text-xs font-mono font-bold">
              <Sparkles className="w-4 h-4 text-[#9580FF]" />
              <span>SIGNATURE FEATURE · SPATIO-TEMPORAL CLUSTERING</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F4F7FC]">
              The City’s Hidden Patterns
            </h2>
          </div>
          <span className="text-xs font-mono text-[#A6B4C8] bg-[#080D16] px-3 py-1.5 rounded-lg border border-[rgba(160,190,220,0.14)]">
            {patterns.length} DETECTED CLUSTERS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Pattern Selection List */}
          <div className="lg:col-span-5 space-y-2.5">
            {patterns.map((pattern) => {
              const isSelected = selectedPattern?.id === pattern.id;
              return (
                <button
                  key={pattern.id}
                  onClick={() => setSelectedPattern(pattern)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#192638] border-[#42E8F5] shadow-lg shadow-[#42E8F5]/10'
                      : 'bg-[#080D16] border-[rgba(160,190,220,0.14)] hover:border-[#42E8F5]/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-[#42E8F5] capitalize">{pattern.category}</span>
                    <span className="text-[#A6B4C8]">{pattern.neighborhood}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#F4F7FC] line-clamp-1">{pattern.title}</h4>
                  <span className="text-[10px] font-mono text-[#FFBF69] mt-1 block">
                    {pattern.issueIds.length} Linked Incidents
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pattern Deep Dive Panel */}
          {selectedPattern && (
            <div className="lg:col-span-7 p-6 rounded-xl bg-[#080D16] border border-[rgba(160,190,220,0.14)] space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-[#42E8F5] uppercase">
                  Cluster Analysis: {selectedPattern.neighborhood}
                </span>
                <h3 className="text-lg font-bold text-[#F4F7FC]">
                  {selectedPattern.title}
                </h3>
              </div>

              <p className="text-xs text-[#A6B4C8] leading-relaxed">
                {selectedPattern.description}
              </p>

              <div className="p-4 rounded-lg bg-[#0C1320] border border-[rgba(160,190,220,0.14)] space-y-2">
                <span className="text-xs font-mono font-bold text-[#FFBF69] block uppercase">
                  Urban Engineering Diagnosis:
                </span>
                <p className="text-xs text-[#F4F7FC] leading-relaxed">
                  {selectedPattern.insight}
                </p>
              </div>

              {/* Contributing Incidents */}
              <div className="space-y-2 pt-2 border-t border-[rgba(160,190,220,0.14)]">
                <span className="text-xs font-mono text-[#A6B4C8] block uppercase">
                  Contributing Incident Reports:
                </span>
                <div className="space-y-2">
                  {selectedPattern.issueIds.map((issueId) => {
                    const matched = issues.find((i) => i.id === issueId);
                    if (!matched) return null;
                    return (
                      <div
                        key={issueId}
                        className="p-3 rounded-lg bg-[#121C2B] border border-[rgba(160,190,220,0.14)] flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="font-mono text-[#42E8F5] font-bold block">{issueId}</span>
                          <span className="text-[#F4F7FC] font-medium line-clamp-1">{matched.title}</span>
                        </div>
                        <button
                          onClick={() => openDetail(issueId)}
                          className="px-2.5 py-1 rounded bg-[#0C1320] hover:bg-[#192638] text-[#F4F7FC] font-mono text-[11px] shrink-0 border border-[rgba(160,190,220,0.18)]"
                        >
                          Inspect
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown & Neighborhood Density Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Category Breakdown Chart */}
        <div className="p-6 rounded-2xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(160,190,220,0.14)]">
            <h3 className="text-sm font-bold text-[#F4F7FC] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#42E8F5]" />
              <span>Issue Distribution by Category</span>
            </h3>
            <span className="text-xs font-mono text-[#A6B4C8]">TOTAL {metrics.totalReports}</span>
          </div>

          <div className="space-y-4">
            {categoryEntries.map(([cat, count]) => {
              const percentage = Math.round((count / maxCategoryCount) * 100);
              return (
                <div 
                  key={cat} 
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, category: cat }));
                    setActiveTab('map');
                  }}
                  className="group/row p-2 -mx-2 rounded-lg hover:bg-[#192638] transition-colors space-y-1.5 text-xs cursor-pointer border border-transparent hover:border-[#42E8F5]/30"
                  title={`Filter ${cat.replace(/_/g, ' ')} on City Map`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[#A6B4C8] group-hover/row:text-[#F4F7FC] transition-colors capitalize flex items-center gap-1.5">
                      <span>{cat.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-[#42E8F5] opacity-0 group-hover/row:opacity-100 transition-opacity">↗</span>
                    </span>
                    <span className="text-[#F4F7FC] group-hover/row:text-[#42E8F5] transition-colors font-bold tabular-nums">{count} reports</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#080D16] overflow-hidden border border-[rgba(160,190,220,0.1)] group-hover/row:border-[#42E8F5]/30 transition-colors">
                    <div 
                      className="h-full bg-gradient-to-r from-[#42E8F5] to-[#9580FF] rounded-full transition-all duration-300 group-hover/row:shadow-[0_0_12px_rgba(66,232,245,0.6)] group-hover/row:brightness-110"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Neighborhood Distribution */}
        <div className="p-6 rounded-2xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(160,190,220,0.14)]">
            <h3 className="text-sm font-bold text-[#F4F7FC] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#9580FF]" />
              <span>Incident Density by Sector</span>
            </h3>
            <span className="text-xs font-mono text-[#A6B4C8]">6 SECTORS</span>
          </div>

          <div className="space-y-3">
            {neighborhoodEntries.map(([neighborhood, count]) => (
              <div 
                key={neighborhood}
                onClick={() => {
                  setFilters((prev) => ({ ...prev, neighborhood }));
                  setActiveTab('map');
                }}
                className="group/sector p-3 rounded-xl bg-[#0C1320] border border-[rgba(160,190,220,0.14)] hover:bg-[#192638] hover:border-[#42E8F5]/40 hover:shadow-[0_0_15px_rgba(66,232,245,0.1)] hover:-translate-y-0.5 transition-all flex items-center justify-between text-xs cursor-pointer"
                title={`Filter ${neighborhood} on City Map`}
              >
                <div>
                  <span className="text-[#F4F7FC] group-hover/sector:text-[#42E8F5] transition-colors font-bold block flex items-center gap-1.5">
                    <span>{neighborhood}</span>
                    <span className="text-[10px] text-[#42E8F5] opacity-0 group-hover/sector:opacity-100 transition-opacity">↗</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#A6B4C8]">
                    {Math.round((count / metrics.totalReports) * 100)}% of metropolitan volume
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#080D16] border border-[rgba(160,190,220,0.18)] group-hover/sector:border-[#42E8F5]/50 group-hover/sector:shadow-[0_0_8px_rgba(66,232,245,0.3)] text-[#42E8F5] font-mono font-bold transition-all">
                  {count} reports
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
