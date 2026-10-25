import React from 'react';
import { useCivic } from '../context/CivicContext';
import { GlowButton } from './GlowButton';
import { 
  X, 
  MapPin, 
  ThumbsUp, 
  Share2, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  ArrowLeftRight,
  Bookmark,
  AlertCircle
} from 'lucide-react';

export const SelectedIssueDrawer: React.FC = () => {
  const { 
    activeIssue, 
    selectIssue, 
    openDetail, 
    supportIssue, 
    toggleSaveIssue,
    setEvidenceCardIssue,
    setWhatChangedIssue,
    activeTab
  } = useCivic();

  if (!activeIssue || activeTab !== 'map') return null;

  const issue = activeIssue;

  return (
    <div 
      className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-[#0C1320] border-l border-[rgba(160,190,220,0.18)] shadow-2xl flex flex-col transition-transform transform duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-label={`Issue details for ${issue.id}`}
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(160,190,220,0.14)] bg-[#080D16]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#42E8F5]">
            {issue.id}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs font-mono text-[#A6B4C8] capitalize">
            {issue.category}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toggleSaveIssue(issue.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              issue.isSaved
                ? 'text-[#9580FF] bg-[#9580FF]/15 border-[#9580FF]/40'
                : 'text-[#A6B4C8] border-[rgba(160,190,220,0.14)] hover:text-[#F4F7FC]'
            }`}
            title="Save to Watchlist"
            aria-label="Save to watchlist"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={() => selectIssue(null)}
            className="p-1.5 rounded-lg text-[#A6B4C8] hover:text-[#F4F7FC] hover:bg-[#121C2B] transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drawer Body Scroll */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Photo Container */}
        <div className="relative rounded-xl overflow-hidden border border-[rgba(160,190,220,0.14)] aspect-video bg-[#080D16] group">
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#080D16]/85 backdrop-blur-sm text-[10px] font-mono font-semibold uppercase text-[#FFBF69] border border-[#FFBF69]/30">
            {issue.severity} Severity
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#080D16]/85 backdrop-blur-sm text-[10px] font-mono text-[#66E6B0] border border-[#66E6B0]/30 font-semibold">
            {issue.status.replace(/_/g, ' ')}
          </div>
        </div>

        {/* Title & Location */}
        <div>
          <h3 className="text-base font-bold text-[#F4F7FC] leading-snug">
            {issue.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-[#A6B4C8] mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#42E8F5] shrink-0" />
            <span>{issue.locationName}</span>
          </div>
        </div>

        {/* Description */}
        <div className="p-3.5 rounded-lg bg-[#121C2B] border border-[rgba(160,190,220,0.14)]">
          <span className="text-[11px] font-mono text-[#A6B4C8] block mb-1 uppercase font-semibold">Field Description</span>
          <p className="text-xs text-[#F4F7FC]/90 leading-relaxed">
            {issue.description}
          </p>
        </div>

        {/* Status Timeline Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#A6B4C8] uppercase font-semibold">Resolution Journey</span>
            <span className="text-[11px] font-mono text-[#42E8F5]">
              {issue.timeline.length} Recorded Steps
            </span>
          </div>
          <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[rgba(160,190,220,0.14)]">
            {issue.timeline.map((entry, idx) => (
              <div key={idx} className="relative pl-6 text-xs">
                <div className={`absolute left-0.5 top-1 w-3 h-3 rounded-full border-2 bg-[#0C1320] ${
                  idx === issue.timeline.length - 1 ? 'border-[#66E6B0] bg-[#66E6B0]' : 'border-[#42E8F5]'
                }`} />
                <div className="flex items-baseline justify-between text-[11px] font-mono text-[#A6B4C8]">
                  <span className="text-[#F4F7FC] font-medium">{entry.label}</span>
                  <span>{entry.date.split(' ')[0]}</span>
                </div>
                <p className="text-[11px] text-[#A6B4C8] mt-0.5">{entry.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Triggers */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[rgba(160,190,220,0.14)]">
          <button
            onClick={() => setEvidenceCardIssue(issue)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#121C2B] hover:bg-[#192638] border border-[rgba(160,190,220,0.14)] text-xs font-medium text-[#F4F7FC] hover:text-[#42E8F5] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#42E8F5]" />
            <span>Evidence Card</span>
          </button>

          {issue.resolvedImageUrl ? (
            <button
              onClick={() => setWhatChangedIssue(issue)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#121C2B] hover:bg-[#192638] border border-[rgba(160,190,220,0.14)] text-xs font-medium text-[#F4F7FC] hover:text-[#66E6B0] transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#66E6B0]" />
              <span>What Changed?</span>
            </button>
          ) : (
            <button
              onClick={() => setWhatChangedIssue(issue)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#121C2B] hover:bg-[#192638] border border-[rgba(160,190,220,0.14)] text-xs font-medium text-[#A6B4C8] transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#A6B4C8]" />
              <span>Progress Status</span>
            </button>
          )}
        </div>
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 bg-[#080D16] border-t border-[rgba(160,190,220,0.14)] flex items-center justify-between gap-3">
        <GlowButton
          variant={issue.hasUserSupported ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => supportIssue(issue.id)}
          className="flex-1"
          icon={<ThumbsUp className={`w-3.5 h-3.5 ${issue.hasUserSupported ? 'fill-current' : ''}`} />}
          aria-label="Support this report"
        >
          {issue.hasUserSupported ? 'Supported' : 'Support Issue'} ({issue.supports})
        </GlowButton>

        <GlowButton
          variant="primary"
          size="sm"
          onClick={() => {
            selectIssue(null);
            openDetail(issue.id);
          }}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
          iconPosition="right"
        >
          Full Details
        </GlowButton>
      </div>
    </div>
  );
};
