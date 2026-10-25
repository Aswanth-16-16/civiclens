import React, { createContext, useContext, useState, useEffect } from 'react';
import { CivicIssue, IssueCategory, IssueSeverity, IssueStatus, UserProfile } from '../types/civic';
import { INITIAL_ISSUES } from '../data/seedIssues';

export interface CivicNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  issueId?: string;
}

interface CivicFilters {
  query: string;
  category: IssueCategory | 'all';
  severity: IssueSeverity | 'all';
  status: IssueStatus | 'all';
  neighborhood: string | 'all';
}

interface CivicContextType {
  issues: CivicIssue[];
  activeIssue: CivicIssue | null;
  activeIssueId: string | null;
  activeTab: 'overview' | 'map' | 'report' | 'community' | 'impact' | 'profile' | 'detail';
  filters: CivicFilters;
  userProfile: UserProfile;
  notifications: CivicNotification[];
  unreadNotificationCount: number;
  isSearchOpen: boolean;
  isNotificationsOpen: boolean;
  evidenceCardIssue: CivicIssue | null;
  whatChangedIssue: CivicIssue | null;
  demoNoticeModalOpen: boolean;
  isTourOpen: boolean;
  setActiveTab: (tab: 'overview' | 'map' | 'report' | 'community' | 'impact' | 'profile' | 'detail') => void;
  selectIssue: (id: string | null) => void;
  openDetail: (id: string) => void;
  setFilters: React.Dispatch<React.SetStateAction<CivicFilters>>;
  resetFilters: () => void;
  supportIssue: (id: string) => void;
  toggleSaveIssue: (id: string) => void;
  addComment: (issueId: string, text: string) => void;
  submitNewReport: (newReport: Omit<CivicIssue, 'id' | 'createdAt' | 'updatedAt' | 'supports' | 'timeline' | 'comments' | 'isDemo'>) => CivicIssue;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  markNotificationsAsRead: () => void;
  resetDemoData: () => void;
  setSearchOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setEvidenceCardIssue: (issue: CivicIssue | null) => void;
  setWhatChangedIssue: (issue: CivicIssue | null) => void;
  setDemoNoticeModalOpen: (open: boolean) => void;
  setTourOpen: (open: boolean) => void;
}

const STORAGE_KEY = 'civiclens_issues_v1';
const USER_KEY = 'civiclens_user_v1';

const defaultUser: UserProfile = {
  name: 'Alex Rivera',
  handle: '@alexrivera_civic',
  neighborhood: 'Downtown Core',
  avatarSeed: 'AR',
  emailNotifications: true,
  radarAlerts: true,
  anonymousSubmissions: false,
  savedWatchlist: ['Downtown Core', 'Arts District'],
};

const initialNotifications: CivicNotification[] = [
  {
    id: 'n1',
    title: 'Resolution Confirmed',
    message: 'Community verified asphalt patch completed on Market & 4th (CVL-2026-1049).',
    date: '10m ago',
    read: false,
    issueId: 'CVL-2026-1049',
  },
  {
    id: 'n2',
    title: 'Duplicate Radar Alert',
    message: '2 similar reports identified near Highland Crest Blvd.',
    date: '2h ago',
    read: false,
    issueId: 'CVL-2026-3401',
  },
  {
    id: 'n3',
    title: 'High Priority Flagged',
    message: 'Potable water main leak reported in Downtown Core with 17 supporters.',
    date: '5h ago',
    read: true,
    issueId: 'CVL-2026-4552',
  },
];

const CivicContext = createContext<CivicContextType | null>(null);

export function CivicProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<CivicIssue[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_ISSUES;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return defaultUser;
  });

  const [activeTab, setActiveTabState] = useState<'overview' | 'map' | 'report' | 'community' | 'impact' | 'profile' | 'detail'>('overview');
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [evidenceCardIssue, setEvidenceCardIssue] = useState<CivicIssue | null>(null);
  const [whatChangedIssue, setWhatChangedIssue] = useState<CivicIssue | null>(null);
  const [demoNoticeModalOpen, setDemoNoticeModalOpen] = useState(false);
  const [isTourOpen, setTourOpen] = useState(false);
  const [notifications, setNotifications] = useState<CivicNotification[]>(initialNotifications);

  const [filters, setFilters] = useState<CivicFilters>({
    query: '',
    category: 'all',
    severity: 'all',
    status: 'all',
    neighborhood: 'all',
  });

  // URL deep links for competition reviewers
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tour') === '1') {
        setTourOpen(true);
      }
      const reportParam = params.get('report');
      if (reportParam) {
        const found = issues.find((i) => i.id.toLowerCase() === reportParam.toLowerCase());
        if (found) {
          setActiveIssueId(found.id);
          setActiveTabState('detail');
        }
      }
      const tabParam = params.get('tab');
      if (tabParam && ['overview', 'map', 'report', 'community', 'impact', 'profile'].includes(tabParam)) {
        setActiveTabState(tabParam as any);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage when issues update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    } catch {
      // storage quota or private mode
    }
  }, [issues]);

  useEffect(() => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  const activeIssue = issues.find((i) => i.id === activeIssueId) || null;

  const selectIssue = (id: string | null) => {
    setActiveIssueId(id);
  };

  const openDetail = (id: string) => {
    setActiveIssueId(id);
    setActiveTabState('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setActiveTab = (tab: 'overview' | 'map' | 'report' | 'community' | 'impact' | 'profile' | 'detail') => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      severity: 'all',
      status: 'all',
      neighborhood: 'all',
    });
  };

  const supportIssue = (id: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id !== id) return issue;
        const already = issue.hasUserSupported;
        return {
          ...issue,
          supports: already ? issue.supports - 1 : issue.supports + 1,
          hasUserSupported: !already,
        };
      })
    );
  };

  const toggleSaveIssue = (id: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id !== id) return issue;
        return {
          ...issue,
          isSaved: !issue.isSaved,
        };
      })
    );
  };

  const addComment = (issueId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      author: userProfile.name,
      role: 'Local Resident',
      text: text.trim(),
      date: 'Just now',
      isVerifiedResident: true,
    };

    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id !== issueId) return issue;
        return {
          ...issue,
          comments: [newComment, ...issue.comments],
        };
      })
    );
  };

  const submitNewReport = (
    newReportData: Omit<CivicIssue, 'id' | 'createdAt' | 'updatedAt' | 'supports' | 'timeline' | 'comments' | 'isDemo'>
  ): CivicIssue => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `CVL-2026-${randomSuffix}`;
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const createdIssue: CivicIssue = {
      ...newReportData,
      id: newId,
      createdAt: nowIso,
      updatedAt: nowIso,
      supports: 1,
      hasUserSupported: true,
      isDemo: true,
      timeline: [
        {
          status: 'submitted',
          label: 'Citizen Report Filed',
          date: formattedDate,
          note: 'Submitted via CIVICLENS AI issue scanner with geolocation.',
          actor: 'citizen',
        },
        {
          status: 'awaiting_verification',
          label: 'Awaiting Community Verification',
          date: formattedDate,
          note: 'Report broadcasting to nearby neighborhood radar.',
          actor: 'platform',
        },
      ],
      comments: [
        {
          id: `c_initial_${Date.now()}`,
          author: userProfile.name,
          role: 'Original Reporter',
          text: 'Filed through CIVICLENS mobile radar scanner.',
          date: 'Just now',
          isVerifiedResident: true,
        },
      ],
    };

    setIssues((prev) => [createdIssue, ...prev]);

    // Add alert notification
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Report Broadcasted',
        message: `Your report ${newId} is now active on the City Radar.`,
        date: 'Just now',
        read: false,
        issueId: newId,
      },
      ...prev,
    ]);

    return createdIssue;
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    setIssues(INITIAL_ISSUES);
    setUserProfile(defaultUser);
    setNotifications(initialNotifications);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <CivicContext.Provider
      value={{
        issues,
        activeIssue,
        activeIssueId,
        activeTab,
        filters,
        userProfile,
        notifications,
        unreadNotificationCount,
        isSearchOpen,
        isNotificationsOpen,
        evidenceCardIssue,
        whatChangedIssue,
        demoNoticeModalOpen,
        setActiveTab,
        selectIssue,
        openDetail,
        setFilters,
        resetFilters,
        supportIssue,
        toggleSaveIssue,
        addComment,
        submitNewReport,
        updateUserProfile,
        markNotificationsAsRead,
        resetDemoData,
        setSearchOpen,
        setNotificationsOpen,
        setEvidenceCardIssue,
        setWhatChangedIssue,
        setDemoNoticeModalOpen,
        isTourOpen,
        setTourOpen,
      }}
    >
      {children}
    </CivicContext.Provider>
  );
}

export function useCivic() {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
}
