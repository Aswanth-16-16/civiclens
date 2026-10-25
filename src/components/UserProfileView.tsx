import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { 
  User, 
  Settings, 
  Bookmark, 
  ThumbsUp, 
  FileText, 
  Shield, 
  Bell, 
  RotateCcw, 
  ArrowRight,
  MapPin,
  Check
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    issues, 
    openDetail, 
    resetDemoData, 
    setActiveTab 
  } = useCivic();

  const [activeTab, setActiveTabLocal] = useState<'my_reports' | 'supported' | 'watchlist' | 'settings'>('my_reports');
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [neighborhoodInput, setNeighborhoodInput] = useState(userProfile.neighborhood);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // My Reports (either created in demo or initial user reported)
  const myReports = issues.filter((i) => i.hasUserSupported || i.id.startsWith('CVL-2026-'));
  const supportedReports = issues.filter((i) => i.hasUserSupported);
  const watchlistReports = issues.filter((i) => i.isSaved);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: nameInput.trim() || userProfile.name,
      neighborhood: neighborhoodInput,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Header Profile Identity Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#9580FF] to-[#42E8F5] flex items-center justify-center text-xl font-bold text-[#080D16] font-mono shadow-lg shadow-[#9580FF]/20">
            {userProfile.avatarSeed}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#F4F7FC]">
              {userProfile.name}
            </h1>
            <div className="flex items-center gap-2 text-xs font-mono text-[#A6B4C8] mt-1">
              <span className="text-[#42E8F5]">{userProfile.handle}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#F4F7FC]">
                <MapPin className="w-3 h-3 text-[#42E8F5]" />
                {userProfile.neighborhood}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stat Badges */}
        <div className="flex items-center gap-4 text-xs font-mono border-t sm:border-t-0 sm:border-l border-[rgba(160,190,220,0.14)] pt-4 sm:pt-0 sm:pl-6">
          <div>
            <span className="text-[#A6B4C8] block text-[10px]">REPORTS FILED</span>
            <span className="text-lg font-bold text-[#F4F7FC] tabular-nums">{myReports.length}</span>
          </div>
          <div>
            <span className="text-[#A6B4C8] block text-[10px]">ENDORSED</span>
            <span className="text-lg font-bold text-[#42E8F5] tabular-nums">{supportedReports.length}</span>
          </div>
          <div>
            <span className="text-[#A6B4C8] block text-[10px]">WATCHLIST</span>
            <span className="text-lg font-bold text-[#9580FF] tabular-nums">{watchlistReports.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[rgba(160,190,220,0.14)] pb-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTabLocal('my_reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'my_reports'
              ? 'bg-[#42E8F5]/10 text-[#42E8F5] font-semibold border border-[#42E8F5]/30'
              : 'text-[#A6B4C8] hover:text-[#F4F7FC]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>My Reports ({myReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('supported')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'supported'
              ? 'bg-[#42E8F5]/10 text-[#42E8F5] font-semibold border border-[#42E8F5]/30'
              : 'text-[#A6B4C8] hover:text-[#F4F7FC]'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Reports I Support ({supportedReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('watchlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'watchlist'
              ? 'bg-[#42E8F5]/10 text-[#42E8F5] font-semibold border border-[#42E8F5]/30'
              : 'text-[#A6B4C8] hover:text-[#F4F7FC]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Watchlist ({watchlistReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-[#42E8F5]/10 text-[#42E8F5] font-semibold border border-[#42E8F5]/30'
              : 'text-[#A6B4C8] hover:text-[#F4F7FC]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Workspace Settings</span>
        </button>
      </div>

      {/* TAB CONTENT: MY REPORTS */}
      {activeTab === 'my_reports' && (
        <div className="space-y-4">
          {myReports.length === 0 ? (
            <div className="p-12 text-center bg-[#121C2B] rounded-2xl border border-[rgba(160,190,220,0.14)]">
              <FileText className="w-10 h-10 text-[#A6B4C8] mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-[#F4F7FC]">No reports filed yet</h4>
              <p className="text-xs text-[#A6B4C8] max-w-sm mx-auto mt-1 mb-4">
                You haven't submitted any civic issue reports. Use the AI scanner to document neighborhood problems.
              </p>
              <button
                onClick={() => setActiveTab('report')}
                className="px-4 py-2 bg-[#42E8F5] text-[#080D16] rounded-lg text-xs font-bold hover:glow-cyan-sm transition-all"
              >
                File First Report
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] hover:border-[#42E8F5]/40 transition-all flex items-start gap-4"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#080D16] shrink-0 border border-[rgba(160,190,220,0.14)]">
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#42E8F5] font-bold">{report.id}</span>
                      <span className="text-[#66E6B0] uppercase text-[10px] font-semibold">
                        {report.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#F4F7FC] truncate">{report.title}</h4>
                    <p className="text-[11px] text-[#A6B4C8] truncate">{report.locationName}</p>
                    <button
                      onClick={() => openDetail(report.id)}
                      className="text-[11px] text-[#42E8F5] hover:underline font-semibold flex items-center gap-1 pt-1"
                    >
                      <span>Track Progress</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SUPPORTED REPORTS */}
      {activeTab === 'supported' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportedReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-xs font-mono text-[#42E8F5] font-bold">{report.id}</span>
                  <h4 className="text-xs font-bold text-[#F4F7FC] line-clamp-1">{report.title}</h4>
                  <span className="text-[11px] text-[#A6B4C8] font-mono">
                    {report.supports} community endorsements
                  </span>
                </div>
                <button
                  onClick={() => openDetail(report.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#0C1320] text-xs text-[#F4F7FC] hover:bg-[#192638] border border-[rgba(160,190,220,0.14)] shrink-0"
                >
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: WATCHLIST */}
      {activeTab === 'watchlist' && (
        <div className="space-y-4">
          {watchlistReports.length === 0 ? (
            <div className="p-12 text-center bg-[#121C2B] rounded-2xl border border-[rgba(160,190,220,0.14)]">
              <Bookmark className="w-8 h-8 text-[#A6B4C8] mx-auto mb-2" />
              <p className="text-xs text-[#A6B4C8]">Your watchlist is currently empty. Bookmark issues to track updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {watchlistReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-xs font-mono text-[#42E8F5] font-bold">{report.id}</span>
                    <h4 className="text-xs font-bold text-[#F4F7FC] line-clamp-1">{report.title}</h4>
                    <span className="text-[11px] text-[#66E6B0] font-mono uppercase font-semibold">
                      {report.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <button
                    onClick={() => openDetail(report.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#0C1320] text-xs text-[#F4F7FC] hover:bg-[#192638] border border-[rgba(160,190,220,0.14)] shrink-0"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)] space-y-6">
          <h3 className="text-base font-bold text-[#F4F7FC]">Profile & Privacy Preferences</h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-mono text-[#A6B4C8] block mb-1">
                DISPLAY NAME
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[#0C1320] border border-[rgba(160,190,220,0.14)] focus:border-[#42E8F5] rounded-lg px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#A6B4C8] block mb-1">
                PRIMARY RESIDENT NEIGHBORHOOD
              </label>
              <select
                value={neighborhoodInput}
                onChange={(e) => setNeighborhoodInput(e.target.value)}
                className="w-full bg-[#0C1320] border border-[rgba(160,190,220,0.14)] focus:border-[#42E8F5] rounded-lg px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              >
                <option value="Downtown Core">Downtown Core</option>
                <option value="East Riverside">East Riverside</option>
                <option value="North Highlands">North Highlands</option>
                <option value="Arts District">Arts District</option>
                <option value="Harbourfront">Harbourfront</option>
                <option value="Oakridge">Oakridge</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#42E8F5] hover:bg-[#5CF0FD] text-[#080D16] font-bold text-xs rounded-lg hover:glow-cyan-sm transition-colors"
              >
                {saveSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{saveSuccess ? 'Preferences Saved' : 'Save Changes'}</span>
              </button>
            </div>
          </form>

          {/* Reset Demo Data Action */}
          <div className="pt-6 border-t border-[rgba(160,190,220,0.14)] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#F4F7FC] block">Demo Environment Reset</span>
              <span className="text-[11px] text-[#A6B4C8]">
                Revert all modified issues, endorsements, and comments back to initial seed data.
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm('Reset entire demonstration dataset to initial seed state?')) {
                  resetDemoData();
                  alert('Demo state restored to original seed.');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FF6B78]/40 text-[#FF6B78] hover:bg-[#FF6B78]/10 text-xs font-mono transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
