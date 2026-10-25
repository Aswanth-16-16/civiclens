import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { filterIssues } from '../utils/civicLogic';
import { IssueCategory } from '../types/civic';
import { 
  Users, 
  MapPin, 
  ThumbsUp, 
  MessageSquare, 
  Filter, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Layers,
  Sparkles,
  Share2
} from 'lucide-react';
import { GlowCard } from './GlowCard';
import { GlowButton } from './GlowButton';

export const CommunityView: React.FC = () => {
  const { issues, supportIssue, openDetail, setEvidenceCardIssue, userProfile } = useCivic();

  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = filterIssues(issues, {
    category: selectedCategory,
    neighborhood: selectedNeighborhood,
    query: searchQuery,
  });

  const neighborhoods = ['all', 'Downtown Core', 'East Riverside', 'North Highlands', 'Arts District', 'Harbourfront', 'Oakridge'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Community Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(160,190,220,0.14)]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9580FF]/15 border border-[#9580FF]/35 text-xs font-mono text-[#9580FF]">
            <Users className="w-3.5 h-3.5" />
            <span>COMMUNITY RADAR BOARD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F4F7FC] tracking-tight">
            Neighborhood Voices & Action
          </h1>
          <p className="text-sm text-[#A6B4C8] max-w-2xl">
            Community-validated civic intelligence across metropolitan districts. Endorse local issues, contribute ground observations, and verify completed repairs.
          </p>
        </div>

        {/* User Identity Mode Box */}
        <div className="p-3.5 rounded-xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] shrink-0 text-xs font-mono">
          <span className="text-[#A6B4C8] block text-[11px]">ACTIVE PARTICIPANT</span>
          <div className="flex items-center gap-2 text-[#F4F7FC] font-bold mt-1">
            <span className="w-2 h-2 rounded-full bg-[#66E6B0]" />
            <span>{userProfile.name}</span>
            <span className="text-[#A6B4C8] font-normal">({userProfile.neighborhood})</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0C1320] border border-[rgba(160,190,220,0.14)]">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121C2B] border border-[rgba(160,190,220,0.14)]">
            <Search className="w-3.5 h-3.5 text-[#A6B4C8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter community reports..."
              className="bg-transparent text-xs text-[#F4F7FC] placeholder-[#A6B4C8] focus:outline-none w-44"
              aria-label="Filter community reports"
            />
          </div>

          {/* Neighborhood */}
          <select
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
            className="bg-[#121C2B] text-xs text-[#F4F7FC] border border-[rgba(160,190,220,0.14)] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#42E8F5]/40"
            aria-label="Filter by neighborhood"
          >
            <option value="all">All Neighborhoods</option>
            {neighborhoods.filter(n => n !== 'all').map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-[#121C2B] text-xs text-[#F4F7FC] border border-[rgba(160,190,220,0.14)] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#42E8F5]/40"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="roads">Roads</option>
            <option value="waste">Sanitation</option>
            <option value="lighting">Lighting</option>
            <option value="water">Water</option>
            <option value="accessibility">Accessibility</option>
            <option value="public_spaces">Public Spaces</option>
          </select>
        </div>

        <span className="text-xs font-mono text-[#A6B4C8]">
          Showing <strong className="text-[#F4F7FC]">{filtered.length}</strong> incidents
        </span>
      </div>

      {/* Issues Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0C1320] border border-[rgba(160,190,220,0.14)] space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#121C2B] text-[#42E8F5] flex items-center justify-center mx-auto border border-[#42E8F5]/30">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F4F7FC]">No matching community reports</h3>
            <p className="text-xs text-[#A6B4C8]">Try expanding your neighborhood or category filter criteria.</p>
          </div>
          <button
            onClick={() => {
              setSelectedNeighborhood('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-[#42E8F5] text-[#080D16] text-xs font-bold hover:glow-cyan-sm transition-all cursor-pointer font-mono"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((issue) => (
          <GlowCard
            key={issue.id}
            tilt={true}
            glowColor="cyan"
            className="flex flex-col overflow-hidden shadow-lg group"
          >
            {/* Image Banner */}
            <div className="aspect-video bg-[#080D16] relative overflow-hidden">
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#080D16]/90 backdrop-blur-sm text-[10px] font-mono text-[#FFBF69] uppercase font-bold border border-[#FFBF69]/40 shadow">
                {issue.severity}
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#080D16]/90 backdrop-blur-sm text-[10px] font-mono text-[#66E6B0] border border-[#66E6B0]/40 font-semibold shadow">
                {issue.status.replace(/_/g, ' ')}
              </div>
            </div>

            {/* Content Interior */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#A6B4C8]">
                  <span className="text-[#42E8F5] font-semibold">{issue.id}</span>
                  <span>·</span>
                  <span className="capitalize">{issue.category}</span>
                  <span>·</span>
                  <span>{issue.neighborhood}</span>
                </div>

                <h3 className="text-sm font-bold text-[#F4F7FC] group-hover:text-[#42E8F5] transition-colors leading-snug line-clamp-2">
                  {issue.title}
                </h3>

                <p className="text-xs text-[#A6B4C8] line-clamp-2 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Extra information revealed on hover */}
              <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-300 ease-out overflow-hidden space-y-1 text-[10px] font-mono text-[#A6B4C8] bg-[#080D16]/90 p-0 group-hover:p-2.5 rounded-lg border border-transparent group-hover:border-[rgba(160,190,220,0.14)]">
                <div className="flex items-center justify-between">
                  <span>Current Status:</span>
                  <span className="text-[#66E6B0] font-semibold">{issue.status.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Audit Events:</span>
                  <span className="text-[#42E8F5]">{issue.timeline.length} logged checkpoints</span>
                </div>
              </div>

              {/* Bottom Support & Comments Row */}
              <div className="pt-3 border-t border-[rgba(160,190,220,0.14)] flex items-center justify-between text-xs">
                <button
                  onClick={() => supportIssue(issue.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                    issue.hasUserSupported
                      ? 'bg-[#42E8F5]/15 text-[#42E8F5] border-[#42E8F5] shadow-[0_0_10px_rgba(66,232,245,0.25)]'
                      : 'bg-[#0C1320] text-[#A6B4C8] border-[rgba(160,190,220,0.14)] hover:text-[#F4F7FC] hover:border-[#42E8F5]/40 hover:bg-[#192638]'
                  }`}
                  aria-label={`Support ${issue.id}`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${issue.hasUserSupported ? 'fill-current' : ''}`} />
                  <span className="font-mono">{issue.supports}</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[#A6B4C8] font-mono text-[11px]">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{issue.comments.length}</span>
                  </span>

                  <GlowButton
                    variant="outline"
                    size="sm"
                    onClick={() => openDetail(issue.id)}
                    icon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                    iconPosition="right"
                    className="group-hover:border-[#42E8F5] group-hover:text-[#42E8F5] group-hover:shadow-[0_0_12px_rgba(66,232,245,0.25)]"
                  >
                    View
                  </GlowButton>
                </div>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
      )}
    </div>
  );
};
