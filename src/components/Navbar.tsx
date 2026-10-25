import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { 
  Compass, 
  MapPin, 
  Plus, 
  Search, 
  Bell, 
  User, 
  Info, 
  Menu, 
  X, 
  Activity, 
  Users,
  Sparkles
} from 'lucide-react';
import { GlowButton } from './GlowButton';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    unreadNotificationCount,
    setSearchOpen,
    setNotificationsOpen,
    setDemoNoticeModalOpen,
    setTourOpen,
    userProfile,
  } = useCivic();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'overview', label: 'Overview', icon: Compass },
    { key: 'map', label: 'City Map', icon: MapPin },
    { key: 'report', label: 'Report Issue', icon: Plus },
    { key: 'community', label: 'Community', icon: Users },
    { key: 'impact', label: 'Impact & Insights', icon: Activity },
  ] as const;

  const handleNavClick = (tab: typeof navItems[number]['key']) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080D16]/92 backdrop-blur-md border-b border-[rgba(160,190,220,0.14)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#42E8F5] rounded-lg cursor-pointer"
            aria-label="CIVICLENS Home"
          >
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[#0C1320] to-[#121C2B] border border-[#42E8F5]/40 flex items-center justify-center shadow-lg shadow-[#42E8F5]/10 group-hover:border-[#42E8F5] group-hover:shadow-[0_0_15px_rgba(66,232,245,0.3)] transition-all">
              <div className="w-4 h-4 rounded-full border-2 border-[#42E8F5] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#9580FF] group-hover:scale-125 transition-transform" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#42E8F5]" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#F4F7FC] flex items-center gap-1.5">
                CIVIC<span className="text-[#42E8F5]">LENS</span>
              </span>
              <span className="hidden sm:block text-[10px] font-mono tracking-wider text-[#A6B4C8] uppercase">
                Civic Intelligence
              </span>
            </div>
          </button>

          {/* Demo Indicator Button */}
          <button
            onClick={() => setDemoNoticeModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-[#42E8F5] bg-[#42E8F5]/10 border border-[#42E8F5]/30 hover:bg-[#42E8F5]/20 hover:border-[#42E8F5]/50 transition-all cursor-pointer"
            title="Click to view demonstration data information"
            aria-label="View demo data notice"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#42E8F5] animate-pulse" />
            <span>DEMO DATA</span>
            <Info className="w-3 h-3 text-[#42E8F5]/80 ml-0.5" />
          </button>

          {/* Judge Tour Button */}
          <button
            onClick={() => setTourOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#9580FF] bg-[#9580FF]/10 border border-[#9580FF]/30 hover:bg-[#9580FF]/25 hover:border-[#9580FF] transition-all cursor-pointer shadow-[0_0_10px_rgba(149,128,255,0.2)]"
            title="Launch interactive platform walkthrough"
            aria-label="Start guided tour"
          >
            <Sparkles className="w-3 h-3 text-[#9580FF]" />
            <span>JUDGE TOUR</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links with Animated Underline */}
        <nav 
          className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`relative px-3 py-1.5 rounded-lg text-xs lg:text-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer group ${
                  isActive
                    ? 'text-[#42E8F5] bg-[#42E8F5]/10 border border-[#42E8F5]/30 font-semibold shadow-sm'
                    : 'text-[#A6B4C8] hover:text-[#F4F7FC] hover:bg-[#121C2B] border border-transparent'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#42E8F5]' : 'text-[#A6B4C8] group-hover:text-[#42E8F5]'}`} />
                <span>{item.label}</span>

                {/* Subtle animated underline effect */}
                <span 
                  className={`absolute bottom-0 left-2 right-2 h-0.5 bg-[#42E8F5] rounded-full transition-transform duration-300 origin-center ${
                    isActive ? 'scale-x-100 opacity-100 shadow-[0_0_8px_rgba(66,232,245,0.8)]' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-40'
                  }`} 
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#A6B4C8] bg-[#0C1320] border border-[rgba(160,190,220,0.14)] hover:border-[#42E8F5]/40 hover:text-[#F4F7FC] hover:shadow-[0_0_12px_rgba(66,232,245,0.15)] transition-all cursor-pointer"
            aria-label="Search reports and neighborhoods"
          >
            <Search className="w-3.5 h-3.5 text-[#A6B4C8]" />
            <span className="hidden xl:inline text-[#A6B4C8]">Search city...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#A6B4C8] bg-[#121C2B] rounded border border-[rgba(160,190,220,0.14)]">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative p-2 rounded-lg text-[#A6B4C8] bg-[#0C1320] border border-[rgba(160,190,220,0.14)] hover:text-[#42E8F5] hover:border-[#42E8F5]/40 hover:shadow-[0_0_12px_rgba(66,232,245,0.2)] transition-all cursor-pointer"
            aria-label={`View notifications (${unreadNotificationCount} unread)`}
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FFBF69] text-[#080D16] text-[10px] font-bold flex items-center justify-center font-mono shadow-[0_0_8px_rgba(255,191,105,0.6)]">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* User Profile (hidden on extra small screens) */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`hidden sm:flex items-center gap-2 p-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#9580FF] bg-[#9580FF]/15 text-[#F4F7FC] shadow-[0_0_12px_rgba(149,128,255,0.25)]'
                : 'border-[rgba(160,190,220,0.14)] bg-[#0C1320] text-[#A6B4C8] hover:border-[#42E8F5]/40'
            }`}
            aria-label="User Profile"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#9580FF] to-[#42E8F5] flex items-center justify-center text-[11px] font-bold text-[#080D16] font-mono shadow-sm">
              {userProfile.avatarSeed}
            </div>
            <span className="hidden lg:inline text-xs font-medium text-[#F4F7FC] truncate max-w-[100px]">
              {userProfile.name.split(' ')[0]}
            </span>
          </button>

          {/* "+ New Report" GlowButton */}
          <GlowButton
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('report')}
            icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
            aria-label="Report a new civic issue"
          >
            <span className="hidden sm:inline">New Report</span>
            <span className="sm:hidden">Report</span>
          </GlowButton>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#A6B4C8] bg-[#0C1320] border border-[rgba(160,190,220,0.14)] hover:text-[#F4F7FC]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[rgba(160,190,220,0.14)] bg-[#080D16]/98 px-4 pt-3 pb-5 space-y-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(160,190,220,0.14)]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTourOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-[11px] font-mono text-[#9580FF] flex items-center gap-1 bg-[#9580FF]/15 px-2 py-0.5 rounded border border-[#9580FF]/30 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#9580FF]" />
                <span>TOUR</span>
              </button>
              <button
                onClick={() => {
                  setDemoNoticeModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-[11px] font-mono text-[#42E8F5] flex items-center gap-1 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#42E8F5]" />
                <span>DEMO</span>
                <Info className="w-3 h-3" />
              </button>
            </div>
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                  isActive
                    ? 'bg-[#42E8F5]/10 text-[#42E8F5] font-medium border border-[#42E8F5]/30'
                    : 'text-[#A6B4C8] hover:bg-[#121C2B] hover:text-[#F4F7FC]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-[rgba(160,190,220,0.14)] flex items-center justify-between">
            <button
              onClick={() => {
                setActiveTab('profile');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs text-[#A6B4C8] hover:text-[#F4F7FC] py-1"
            >
              <User className="w-4 h-4 text-[#9580FF]" />
              <span>Signed in as {userProfile.name}</span>
            </button>
            <button
              onClick={() => {
                setSearchOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs text-[#42E8F5] flex items-center gap-1 py-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search (⌘K)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
