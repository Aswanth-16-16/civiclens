import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { 
  ArrowLeft, 
  MapPin, 
  ThumbsUp, 
  Share2, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  ArrowLeftRight, 
  Bookmark, 
  MessageSquare, 
  Send,
  Flag,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';
import { GlowButton } from './GlowButton';

export const ReportDetailView: React.FC = () => {
  const { 
    activeIssue, 
    setActiveTab, 
    supportIssue, 
    toggleSaveIssue, 
    addComment, 
    setEvidenceCardIssue, 
    setWhatChangedIssue,
    issues,
    openDetail
  } = useCivic();

  const [newCommentText, setNewCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [flagged, setFlagged] = useState(false);

  if (!activeIssue) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-[#A6B4C8] text-sm">No report currently selected.</p>
        <button
          onClick={() => setActiveTab('map')}
          className="mt-4 px-4 py-2 bg-[#42E8F5] text-[#080D16] rounded-lg text-xs font-bold hover:glow-cyan-sm transition-all"
        >
          Return to City Map
        </button>
      </div>
    );
  }

  const issue = activeIssue;

  // Nearby similar reports
  const similarIssues = issues
    .filter((i) => i.id !== issue.id && (i.category === issue.category || i.neighborhood === issue.neighborhood))
    .slice(0, 3);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(issue.id, newCommentText.trim());
    setNewCommentText('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `?report=${issue.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-1.5 text-xs text-[#A6B4C8] hover:text-[#F4F7FC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to City Overview</span>
        </button>

        <div className="flex items-center gap-2">
          <GlowButton
            variant="secondary"
            size="sm"
            onClick={() => setEvidenceCardIssue(issue)}
            icon={<ShieldCheck className="w-3.5 h-3.5 text-[#42E8F5]" />}
          >
            Civic Evidence Card
          </GlowButton>

          {issue.resolvedImageUrl && (
            <GlowButton
              variant="secondary"
              size="sm"
              onClick={() => setWhatChangedIssue(issue)}
              icon={<ArrowLeftRight className="w-3.5 h-3.5 text-[#66E6B0]" />}
            >
              What Changed?
            </GlowButton>
          )}

          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg bg-[#0C1320] text-[#A6B4C8] hover:text-[#F4F7FC] border border-[rgba(160,190,220,0.14)]"
            title="Copy Report Link"
            aria-label="Copy report link"
          >
            {copied ? <Check className="w-4 h-4 text-[#66E6B0]" /> : <Copy className="w-4 h-4" />}
          </button>

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
        </div>
      </div>

      {/* Main Report Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-[#42E8F5] font-bold text-sm">{issue.id}</span>
          <span className="text-slate-600">·</span>
          <span className="capitalize text-[#F4F7FC]">{issue.category}</span>
          <span className="text-slate-600">·</span>
          <span className="text-[#A6B4C8]">{issue.neighborhood}</span>
          <span className="text-slate-600">·</span>
          <span className="text-[#66E6B0] font-semibold uppercase">
            {issue.status.replace(/_/g, ' ')}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F7FC] leading-snug">
          {issue.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#A6B4C8]">
          <span className="flex items-center gap-1 text-[#F4F7FC]">
            <MapPin className="w-3.5 h-3.5 text-[#42E8F5]" />
            <span>{issue.locationName}</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#A6B4C8]" />
            <span>Logged on {issue.createdAt.split('T')[0]}</span>
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Media & Narrative */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Photo Card */}
          <div className="rounded-2xl overflow-hidden border border-[rgba(160,190,220,0.14)] bg-[#0C1320] aspect-video relative group">
            <img
              src={issue.imageUrl}
              alt={issue.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#080D16]/85 backdrop-blur-sm text-xs font-mono text-[#FFBF69] border border-[#FFBF69]/30 font-semibold">
              SEVERITY: {issue.severity.toUpperCase()}
            </div>
            {issue.aiSuggested && (
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-[#080D16]/85 backdrop-blur-sm text-xs font-mono text-[#42E8F5] border border-[#42E8F5]/30">
                AI COMPUTER VISION VERIFIED
              </div>
            )}
          </div>

          {/* Description Card */}
          <div className="p-6 rounded-2xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] space-y-3">
            <span className="text-xs font-mono text-[#A6B4C8] block uppercase font-semibold">
              Field Observation Details
            </span>
            <p className="text-sm text-[#F4F7FC] leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Community Endorsement & Flag Row */}
          <div className="p-4 rounded-xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] flex items-center justify-between gap-4">
            <GlowButton
              variant={issue.hasUserSupported ? 'primary' : 'secondary'}
              size="md"
              onClick={() => supportIssue(issue.id)}
              icon={<ThumbsUp className={`w-4 h-4 ${issue.hasUserSupported ? 'fill-current' : ''}`} />}
            >
              {issue.hasUserSupported ? 'Supported by You' : 'Support This Report'} ({issue.supports})
            </GlowButton>

            <button
              onClick={() => {
                setFlagged(!flagged);
                alert(flagged ? 'Flag removed.' : 'Report flagged for community moderation.');
              }}
              className="flex items-center gap-1.5 text-xs text-[#A6B4C8] hover:text-[#FFBF69] transition-colors"
            >
              <Flag className={`w-3.5 h-3.5 ${flagged ? 'text-[#FFBF69] fill-current' : ''}`} />
              <span>{flagged ? 'Flagged for Review' : 'Flag Inaccuracy'}</span>
            </button>
          </div>

          {/* Community Comments Section */}
          <div className="p-6 rounded-2xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(160,190,220,0.14)]">
              <div className="flex items-center gap-2 text-[#F4F7FC] font-bold text-sm">
                <MessageSquare className="w-4 h-4 text-[#42E8F5]" />
                <span>Community Comments ({issue.comments.length})</span>
              </div>
              <span className="text-xs font-mono text-[#A6B4C8]">VERIFIED RESIDENTS</span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <textarea
                rows={2}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add a constructive update, severity observation, or verification note..."
                maxLength={400}
                className="w-full bg-[#0C1320] border border-[rgba(160,190,220,0.14)] focus:border-[#42E8F5] rounded-xl p-3 text-xs text-[#F4F7FC] placeholder-[#A6B4C8] focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#A6B4C8]">
                  {400 - newCommentText.length} chars remaining
                </span>
                <GlowButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!newCommentText.trim()}
                  icon={<Send className="w-3 h-3" />}
                >
                  Post Update
                </GlowButton>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4 pt-2">
              {issue.comments.length === 0 ? (
                <p className="text-xs text-[#A6B4C8] text-center py-4">
                  No community comments yet. Be the first to verify this issue.
                </p>
              ) : (
                issue.comments.map((comment) => (
                  <div key={comment.id} className="p-3.5 rounded-xl bg-[#0C1320] border border-[rgba(160,190,220,0.14)] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F4F7FC]">{comment.author}</span>
                        {comment.isVerifiedResident && (
                          <span className="text-[10px] font-mono text-[#66E6B0] bg-[#66E6B0]/10 px-1.5 py-0.5 rounded font-semibold">
                            Verified Neighbor
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-[#A6B4C8]">{comment.date}</span>
                    </div>
                    <p className="text-xs text-[#F4F7FC]/90 leading-relaxed">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Resolution Journey Timeline & Nearby Issues */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Resolution Timeline */}
          <div className="p-6 rounded-2xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(160,190,220,0.14)]">
              <span className="text-xs font-mono font-bold text-[#F4F7FC] uppercase tracking-wider">
                Resolution Journey
              </span>
              <span className="text-xs font-mono text-[#42E8F5]">
                {issue.timeline.length} MILESTONES
              </span>
            </div>

            <div className="relative space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[rgba(160,190,220,0.14)]">
              {issue.timeline.map((step, idx) => {
                const isLatest = idx === issue.timeline.length - 1;
                return (
                  <div key={idx} className="relative pl-7 space-y-1">
                    <div className={`absolute left-1 top-1 w-3.5 h-3.5 rounded-full border-2 bg-[#0C1320] ${
                      isLatest ? 'border-[#66E6B0] bg-[#66E6B0]' : 'border-[#42E8F5]'
                    }`} />
                    <div className="flex items-center justify-between text-xs">
                      <h4 className="font-bold text-[#F4F7FC]">{step.label}</h4>
                      <span className="text-[10px] font-mono text-[#A6B4C8]">{step.date}</span>
                    </div>
                    <p className="text-xs text-[#A6B4C8]">{step.note}</p>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">
                      Actor: {step.actor}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coordinate & Geostamp Box */}
          <div className="p-4 rounded-xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] space-y-3">
            <span className="text-xs font-mono text-[#A6B4C8] block uppercase font-semibold">
              Geographic Coordinates
            </span>
            <div className="flex items-center justify-between text-xs font-mono text-[#F4F7FC] bg-[#0C1320] p-2.5 rounded-lg border border-[rgba(160,190,220,0.14)]">
              <span>{issue.coordinates.lat.toFixed(4)}° N, {issue.coordinates.lng.toFixed(4)}° W</span>
              <button
                onClick={() => setActiveTab('map')}
                className="text-[#42E8F5] hover:underline"
              >
                Inspect on Map
              </button>
            </div>
          </div>

          {/* Nearby Similar Reports */}
          {similarIssues.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] space-y-3">
              <span className="text-xs font-mono text-[#A6B4C8] block uppercase font-semibold">
                Similar Reports in Vicinity
              </span>
              <div className="space-y-2.5">
                {similarIssues.map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => openDetail(sim.id)}
                    className="w-full text-left p-3 rounded-xl bg-[#0C1320] hover:bg-[#192638] border border-[rgba(160,190,220,0.14)] hover:border-[#42E8F5]/40 transition-all block group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="text-[#42E8F5]">{sim.id}</span>
                      <span className="text-[#A6B4C8]">{sim.neighborhood}</span>
                    </div>
                    <h5 className="text-xs font-bold text-[#F4F7FC] group-hover:text-[#42E8F5] transition-colors truncate">
                      {sim.title}
                    </h5>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
