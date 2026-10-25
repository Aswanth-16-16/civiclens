export type IssueCategory = 
  | 'roads' 
  | 'waste' 
  | 'lighting' 
  | 'water' 
  | 'accessibility' 
  | 'public_spaces';

export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IssueStatus = 
  | 'submitted' 
  | 'awaiting_verification' 
  | 'verified' 
  | 'forwarded_to_authority' 
  | 'resolution_reported' 
  | 'resolved';

export interface TimelineEntry {
  status: IssueStatus;
  label: string;
  date: string;
  note: string;
  actor: 'citizen' | 'community' | 'platform' | 'authority';
}

export interface IssueComment {
  id: string;
  author: string;
  role?: string;
  text: string;
  date: string;
  isVerifiedResident?: boolean;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  coordinates: {
    lat: number;
    lng: number;
  };
  locationName: string;
  neighborhood: string;
  createdAt: string;
  updatedAt: string;
  supports: number;
  hasUserSupported?: boolean;
  isSaved?: boolean;
  imageUrl: string;
  resolvedImageUrl?: string;
  aiSuggested?: boolean;
  aiConfidence?: number;
  timeline: TimelineEntry[];
  comments: IssueComment[];
  isDemo: boolean;
}

export interface HiddenPattern {
  id: string;
  title: string;
  category: IssueCategory;
  neighborhood: string;
  description: string;
  insight: string;
  issueIds: string[];
  severity: IssueSeverity;
}

export interface UserProfile {
  name: string;
  handle: string;
  neighborhood: string;
  avatarSeed: string;
  emailNotifications: boolean;
  radarAlerts: boolean;
  anonymousSubmissions: boolean;
  savedWatchlist: string[];
}
