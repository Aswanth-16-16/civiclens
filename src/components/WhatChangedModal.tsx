import React, { useState, useRef } from 'react';
import { useCivic } from '../context/CivicContext';
import { X, ArrowLeftRight, Clock } from 'lucide-react';
import { GlowButton } from './GlowButton';

export const WhatChangedModal: React.FC = () => {
  const { whatChangedIssue, setWhatChangedIssue } = useCivic();
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  if (!whatChangedIssue) return null;

  const issue = whatChangedIssue;
  const hasResolvedImage = Boolean(issue.resolvedImageUrl);

  const handlePointerDown = () => {
    isDraggingRef.current = true;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="What Changed Before and After Inspection"
      onClick={() => setWhatChangedIssue(null)}
      onPointerUp={handlePointerUp}
    >
      <div
        className="w-full max-w-2xl bg-[#0C1320] border border-[rgba(160,190,220,0.14)] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
        onPointerMove={handlePointerMove}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(160,190,220,0.14)] bg-[#080D16]">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-[#66E6B0]" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#F4F7FC]">
                “What Changed?” Resolution Verification
              </h3>
              <span className="text-[11px] font-mono text-[#A6B4C8]">
                {issue.id} · {issue.title}
              </span>
            </div>
          </div>
          <button
            onClick={() => setWhatChangedIssue(null)}
            className="text-[#A6B4C8] hover:text-[#F4F7FC] p-1 rounded-lg transition-colors"
            aria-label="Close comparison view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!hasResolvedImage ? (
            <div className="p-8 text-center bg-[#121C2B] rounded-xl border border-[rgba(160,190,220,0.14)]">
              <Clock className="w-10 h-10 text-[#FFBF69] mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-[#F4F7FC]">Work Still in Progress</h4>
              <p className="text-xs text-[#A6B4C8] max-w-md mx-auto mt-1 leading-relaxed">
                A verified resolution photograph has not yet been submitted for this report.
                The interactive before-and-after slider becomes available once municipal repair crews or community monitors upload confirmed completion imagery.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080D16] border border-[rgba(160,190,220,0.14)] text-xs font-mono text-[#A6B4C8]">
                <span>Current Status:</span>
                <span className="text-[#FFBF69] font-bold uppercase">{issue.status.replace(/_/g, ' ')}</span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-[#A6B4C8] mb-3 flex items-center justify-between">
                <span>Drag the central divider horizontally to inspect the repaired surface:</span>
                <span className="font-mono text-[#66E6B0] text-[11px] font-semibold">{Math.round(sliderPosition)}% View Split</span>
              </p>

              {/* Interactive Draggable Comparison Container */}
              <div
                ref={containerRef}
                className="relative w-full aspect-[4/3] rounded-xl overflow-hidden select-none cursor-ew-resize border border-[rgba(160,190,220,0.2)] bg-[#080D16]"
                onPointerDown={handlePointerDown}
              >
                {/* Background Image: AFTER (Resolution) */}
                <img
                  src={issue.resolvedImageUrl}
                  alt="Repaired Resolution"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#080D16]/90 backdrop-blur-sm text-[11px] font-mono text-[#66E6B0] border border-[#66E6B0]/40 z-10 shadow-md">
                  AFTER: RESOLVED
                </div>

                {/* Foreground Image: BEFORE (Original Problem), clipped by sliderPosition */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={issue.imageUrl}
                    alt="Original Problem"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#080D16]/90 backdrop-blur-sm text-[11px] font-mono text-[#FFBF69] border border-[#FFBF69]/40 z-10 shadow-md">
                    BEFORE: DEFECT
                  </div>
                </div>

                {/* Vertical Divider Bar */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#42E8F5] shadow-[0_0_12px_rgba(66,232,245,0.8)] z-20 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0C1320] border-2 border-[#42E8F5] shadow-[0_0_15px_rgba(66,232,245,0.4)] flex items-center justify-center text-[#42E8F5]">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Evidence notes */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#121C2B] border border-[rgba(160,190,220,0.14)]">
                  <span className="text-[#A6B4C8] font-mono text-[10px] block uppercase">Original Logging</span>
                  <p className="text-[#F4F7FC] mt-1">{issue.description}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#121C2B] border border-[rgba(160,190,220,0.14)]">
                  <span className="text-[#66E6B0] font-mono text-[10px] block uppercase">Recorded Outcome</span>
                  <p className="text-[#F4F7FC] mt-1">
                    Defect cleared and verified by community members on{' '}
                    {issue.timeline[issue.timeline.length - 1]?.date || 'Oct 22, 2026'}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3.5 bg-[#080D16] border-t border-[rgba(160,190,220,0.14)] flex items-center justify-end">
          <GlowButton
            variant="primary"
            size="sm"
            onClick={() => setWhatChangedIssue(null)}
          >
            Close Comparison
          </GlowButton>
        </div>
      </div>
    </div>
  );
};
