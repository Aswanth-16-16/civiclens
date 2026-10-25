import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { X, Copy, Check, Download, ShieldCheck, MapPin } from 'lucide-react';
import { GlowButton } from './GlowButton';

export const CivicEvidenceCardModal: React.FC = () => {
  const { evidenceCardIssue, setEvidenceCardIssue } = useCivic();
  const [copied, setCopied] = useState(false);

  if (!evidenceCardIssue) return null;

  const issue = evidenceCardIssue;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `?report=${issue.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Civic Evidence Card"
      onClick={() => setEvidenceCardIssue(null)}
    >
      <div
        className="w-full max-w-xl bg-[#0C1320] border border-[rgba(160,190,220,0.18)] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(160,190,220,0.14)] bg-[#080D16]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#42E8F5]" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#A6B4C8] uppercase">
              Official Civic Evidence Record
            </span>
          </div>
          <button
            onClick={() => setEvidenceCardIssue(null)}
            className="text-[#A6B4C8] hover:text-[#F4F7FC] p-1 rounded-lg transition-colors"
            aria-label="Close evidence card"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Evidence Card Interior */}
        <div className="p-6 space-y-6">
          {/* Card Border & Outer Styling */}
          <div className="border border-[rgba(160,190,220,0.18)] rounded-xl p-5 bg-[#121C2B] relative overflow-hidden">
            {/* Corner Decorative Coordinate Ticks */}
            <div className="absolute top-2 left-2 text-[9px] font-mono text-[#A6B4C8]/70">
              LAT {issue.coordinates.lat.toFixed(4)}° N
            </div>
            <div className="absolute top-2 right-2 text-[9px] font-mono text-[#A6B4C8]/70">
              LON {issue.coordinates.lng.toFixed(4)}° W
            </div>

            {/* Header info */}
            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#42E8F5]">
                  {issue.id}
                </span>
                <h3 className="text-lg font-bold text-[#F4F7FC] mt-0.5 leading-snug">
                  {issue.title}
                </h3>
              </div>
              <div className="px-2.5 py-1 rounded bg-[#192638] border border-[rgba(160,190,220,0.18)] text-right shrink-0">
                <span className="text-[10px] font-mono text-[#A6B4C8] block uppercase">Status</span>
                <span className="text-xs font-mono font-bold text-[#66E6B0] uppercase">
                  {issue.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Photo Preview */}
            <div className="mt-4 rounded-lg overflow-hidden border border-[rgba(160,190,220,0.14)] aspect-video bg-[#080D16] relative">
              <img
                src={issue.imageUrl}
                alt={issue.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#080D16]/90 border border-[#42E8F5]/30 backdrop-blur-sm text-[10px] font-mono text-[#42E8F5]">
                VERIFIED GEOSTAMP
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs border-t border-[rgba(160,190,220,0.14)] pt-4">
              <div>
                <span className="text-[#A6B4C8] text-[11px] block">Category</span>
                <span className="font-semibold text-[#F4F7FC] capitalize">{issue.category.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-[#A6B4C8] text-[11px] block">Severity</span>
                <span className="font-semibold text-[#FFBF69] capitalize">{issue.severity}</span>
              </div>
              <div>
                <span className="text-[#A6B4C8] text-[11px] block">Endorsements</span>
                <span className="font-semibold text-[#F4F7FC] font-mono">{issue.supports} residents</span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-[#A6B4C8] text-[11px] block">Location</span>
                <span className="font-medium text-[#F4F7FC] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#42E8F5] shrink-0" />
                  <span>{issue.locationName} ({issue.neighborhood})</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 pt-3 border-t border-[rgba(160,190,220,0.14)]">
              <span className="text-[#A6B4C8] text-[11px] block mb-1">Citizen Observation</span>
              <p className="text-xs text-[#A6B4C8] leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* Cryptographic hash simulation */}
            <div className="mt-4 pt-3 border-t border-[rgba(160,190,220,0.14)] flex items-center justify-between text-[10px] font-mono text-[#A6B4C8]/80">
              <span>SHA-256: 7f8a...{issue.id.slice(-4)}c1</span>
              <span>DEMO REPOSITORY RECORD</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-[#080D16] border-t border-[rgba(160,190,220,0.14)] flex items-center justify-between gap-3">
          <GlowButton
            variant="secondary"
            size="sm"
            onClick={handleCopyLink}
            icon={copied ? <Check className="w-4 h-4 text-[#66E6B0]" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Link Copied!' : 'Copy Record Link'}
          </GlowButton>

          <div className="flex items-center gap-2">
            <GlowButton
              variant="primary"
              size="sm"
              onClick={handlePrint}
              icon={<Download className="w-4 h-4" />}
            >
              Export Evidence Card
            </GlowButton>
          </div>
        </div>
      </div>
    </div>
  );
};
