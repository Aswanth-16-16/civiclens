import React from 'react';
import { useCivic } from '../context/CivicContext';
import { Info, X, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';
import { GlowButton } from './GlowButton';

export const DemoNoticeModal: React.FC = () => {
  const { demoNoticeModalOpen, setDemoNoticeModalOpen, resetDemoData } = useCivic();

  if (!demoNoticeModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Demonstration Mode Transparency"
      onClick={() => setDemoNoticeModalOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-[#0C1320] border border-[rgba(160,190,220,0.14)] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(160,190,220,0.14)]">
          <div className="flex items-center gap-2 text-[#42E8F5]">
            <Info className="w-5 h-5" />
            <h3 className="font-bold text-base text-[#F4F7FC]">Demonstration & Transparency Notice</h3>
          </div>
          <button
            onClick={() => setDemoNoticeModalOpen(false)}
            className="text-[#A6B4C8] hover:text-[#F4F7FC] p-1 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-sm text-[#A6B4C8]">
          <div className="p-3.5 rounded-lg bg-[#121C2B] border border-[rgba(160,190,220,0.14)] space-y-2">
            <div className="flex items-center gap-2 text-[#FFBF69] text-xs font-mono font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>CIVIC DISCLOSURE POLICY</span>
            </div>
            <p className="text-xs text-[#A6B4C8] leading-relaxed">
              CIVICLENS operates in <strong className="text-[#F4F7FC]">Demonstration Mode</strong>. The issues, metrics, status timelines, and community comments presented are simulated scenarios illustrating how high-precision civic intelligence works.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-[#A6B4C8]">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#66E6B0] shrink-0 mt-0.5" />
              <span><strong className="text-[#F4F7FC]">Interactive AI Classification:</strong> Uses smart visual heuristics and Gemini computer vision to assist category & severity detection.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#66E6B0] shrink-0 mt-0.5" />
              <span><strong className="text-[#F4F7FC]">Duplicate Radar:</strong> Real Haversine spatial proximity and lexical similarity match reports in real time.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#66E6B0] shrink-0 mt-0.5" />
              <span><strong className="text-[#F4F7FC]">No Unauthorized Municipal Forwarding:</strong> We never pretend reports were transmitted to public city works departments without official API authorization.</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[rgba(160,190,220,0.14)] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (confirm('Reset all demo issues and comments back to pristine seed dataset?')) {
                resetDemoData();
                setDemoNoticeModalOpen(false);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#A6B4C8] hover:text-[#FFBF69] border border-[rgba(160,190,220,0.18)] rounded-lg hover:border-[#FFBF69]/40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed</span>
          </button>

          <GlowButton
            variant="primary"
            size="sm"
            onClick={() => setDemoNoticeModalOpen(false)}
          >
            Understood
          </GlowButton>
        </div>
      </div>
    </div>
  );
};
