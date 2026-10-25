/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CivicProvider, useCivic } from './context/CivicContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OverviewView } from './components/OverviewView';
import { LeafletCityMap } from './components/LeafletCityMap';
import { AIReportWizard } from './components/AIReportWizard';
import { CommunityView } from './components/CommunityView';
import { ImpactView } from './components/ImpactView';
import { UserProfileView } from './components/UserProfileView';
import { ReportDetailView } from './components/ReportDetailView';
import { SelectedIssueDrawer } from './components/SelectedIssueDrawer';
import { SearchModal } from './components/SearchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { DemoNoticeModal } from './components/DemoNoticeModal';
import { CivicEvidenceCardModal } from './components/CivicEvidenceCardModal';
import { WhatChangedModal } from './components/WhatChangedModal';
import { GuidedTourModal } from './components/GuidedTourModal';

function MainAppShell() {
  const { activeTab } = useCivic();

  return (
    <div className="min-h-screen flex flex-col bg-[#080D16] text-[#F4F7FC] selection:bg-[#42E8F5]/25 selection:text-[#42E8F5]">
      {/* Sticky Global Top Navigation */}
      <Navbar />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'map' && <LeafletCityMap />}
        {activeTab === 'report' && <AIReportWizard />}
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'impact' && <ImpactView />}
        {activeTab === 'profile' && <UserProfileView />}
        {activeTab === 'detail' && <ReportDetailView />}
      </main>

      {/* Footer (hidden on full-screen map workspace to maximize map interaction) */}
      {activeTab !== 'map' && <Footer />}

      {/* Global Interactive Drawers & Overlays */}
      <SelectedIssueDrawer />
      <SearchModal />
      <NotificationsModal />
      <DemoNoticeModal />
      <CivicEvidenceCardModal />
      <WhatChangedModal />
      <GuidedTourModal />
    </div>
  );
}

export default function App() {
  return (
    <CivicProvider>
      <MainAppShell />
    </CivicProvider>
  );
}
