import React from 'react';
import { useCivic } from '../context/CivicContext';
import { Info } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setDemoNoticeModalOpen, resetDemoData } = useCivic();

  return (
    <footer className="w-full bg-[#080D16] border-t border-[rgba(160,190,220,0.14)] py-12 text-xs text-[#A6B4C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[rgba(160,190,220,0.14)]">
          
          {/* Brand info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#121C2B] border border-[#42E8F5]/40 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full border border-[#42E8F5] bg-[#42E8F5]/20" />
              </div>
              <span className="text-sm font-bold text-[#F4F7FC] tracking-tight">
                CIVIC<span className="text-[#42E8F5]">LENS</span>
              </span>
            </div>
            <p className="text-xs text-[#A6B4C8] max-w-sm leading-relaxed">
              AI-powered civic intelligence platform. Turning everyday neighborhood problems into visible, trackable reports.
            </p>
          </div>

          {/* Site Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <button onClick={() => setActiveTab('overview')} className="hover:text-[#42E8F5] transition-colors">
              Overview
            </button>
            <button onClick={() => setActiveTab('map')} className="hover:text-[#42E8F5] transition-colors">
              City Map
            </button>
            <button onClick={() => setActiveTab('report')} className="hover:text-[#42E8F5] transition-colors">
              Report Issue
            </button>
            <button onClick={() => setActiveTab('community')} className="hover:text-[#42E8F5] transition-colors">
              Community
            </button>
            <button onClick={() => setActiveTab('impact')} className="hover:text-[#42E8F5] transition-colors">
              Impact & Insights
            </button>
            <button onClick={() => setActiveTab('profile')} className="hover:text-[#42E8F5] transition-colors">
              My Profile
            </button>
          </div>
        </div>

        {/* Bottom copyright and demo disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#A6B4C8]/80">
          <p>© 2026 CIVICLENS. Demonstration civic technology platform.</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDemoNoticeModalOpen(true)}
              className="text-[#42E8F5] hover:underline flex items-center gap-1 font-medium"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Demo Data Transparency</span>
            </button>
            <span>·</span>
            <button
              onClick={() => {
                if (confirm('Reset entire demonstration dataset?')) {
                  resetDemoData();
                }
              }}
              className="hover:text-[#F4F7FC] transition-colors"
            >
              Reset Seed
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
