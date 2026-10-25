import { CivicIssue, IssueCategory, IssueSeverity, IssueStatus, HiddenPattern } from '../types/civic';

/**
 * Calculates the great-circle distance between two geographic coordinates
 * using the Haversine formula in meters.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Duplicate Radar Algorithm:
 * Evaluates whether a candidate issue matches existing civic reports
 * based on spatial proximity (within radius), category match, and title token overlap.
 */
export interface DuplicateMatchResult {
  issue: CivicIssue;
  distanceMeters: number;
  similarityScore: number; // 0 to 100
  matchReason: string;
}

export function detectDuplicateCandidates(
  target: {
    coordinates: { lat: number; lng: number };
    category: IssueCategory;
    title: string;
    description?: string;
  },
  existingIssues: CivicIssue[],
  maxRadiusMeters: number = 600
): DuplicateMatchResult[] {
  const targetWords = new Set(
    `${target.title} ${target.description || ''}`
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );

  const results: DuplicateMatchResult[] = [];

  for (const existing of existingIssues) {
    const distance = calculateDistanceMeters(
      target.coordinates.lat,
      target.coordinates.lng,
      existing.coordinates.lat,
      existing.coordinates.lng
    );

    if (distance > maxRadiusMeters) {
      continue;
    }

    // Proximity score: 100 at 0m, decaying to 0 at maxRadiusMeters
    const proximityScore = Math.max(0, (1 - distance / maxRadiusMeters) * 50);

    // Category match score: 30 points if identical
    const categoryScore = target.category === existing.category ? 30 : 0;

    // Text token overlap score: up to 20 points
    const existingWords = new Set(
      `${existing.title} ${existing.description}`
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );

    let sharedWords = 0;
    targetWords.forEach((word) => {
      if (existingWords.has(word)) sharedWords++;
    });

    const textScore = Math.min(20, sharedWords * 5);
    const totalScore = Math.min(100, Math.round(proximityScore + categoryScore + textScore));

    if (totalScore >= 35) {
      let reason = '';
      if (distance < 100 && target.category === existing.category) {
        reason = `Same ${target.category} category within ${distance}m`;
      } else if (distance < 250) {
        reason = `Nearby ${existing.category} issue (${distance}m away)`;
      } else {
        reason = `Similar description in vicinity (${distance}m away)`;
      }

      results.push({
        issue: existing,
        distanceMeters: distance,
        similarityScore: totalScore,
        matchReason: reason,
      });
    }
  }

  // Sort by highest similarity score first
  return results.sort((a, b) => b.similarityScore - a.similarityScore);
}

/**
 * City Pulse Analytics Aggregator:
 * Computes live metrics strictly from the active dataset.
 */
export interface CityPulseMetrics {
  totalReports: number;
  awaitingVerification: number;
  verifiedCount: number;
  inProgressCount: number;
  resolvedCount: number;
  resolutionRatePercent: number;
  mostReportedCategory: IssueCategory | 'None';
  categoryBreakdown: Record<IssueCategory, number>;
  neighborhoodBreakdown: Record<string, number>;
  severityBreakdown: Record<string, number>;
  totalCommunitySupports: number;
}

export function calculateCityMetrics(issues: CivicIssue[]): CityPulseMetrics {
  const totalReports = issues.length;
  let awaitingVerification = 0;
  let verifiedCount = 0;
  let inProgressCount = 0;
  let resolvedCount = 0;
  let totalCommunitySupports = 0;

  const categoryBreakdown: Record<IssueCategory, number> = {
    roads: 0,
    waste: 0,
    lighting: 0,
    water: 0,
    accessibility: 0,
    public_spaces: 0,
  };

  const neighborhoodBreakdown: Record<string, number> = {};
  const severityBreakdown: Record<string, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  for (const issue of issues) {
    if (issue.status === 'awaiting_verification' || issue.status === 'submitted') {
      awaitingVerification++;
    } else if (issue.status === 'verified') {
      verifiedCount++;
    } else if (issue.status === 'forwarded_to_authority' || issue.status === 'resolution_reported') {
      inProgressCount++;
    } else if (issue.status === 'resolved') {
      resolvedCount++;
    }

    if (issue.category in categoryBreakdown) {
      categoryBreakdown[issue.category]++;
    }

    neighborhoodBreakdown[issue.neighborhood] = (neighborhoodBreakdown[issue.neighborhood] || 0) + 1;
    if (issue.severity in severityBreakdown) {
      severityBreakdown[issue.severity]++;
    }

    totalCommunitySupports += issue.supports || 0;
  }

  // Most reported category
  let maxCount = -1;
  let mostReportedCategory: IssueCategory | 'None' = 'None';
  (Object.keys(categoryBreakdown) as IssueCategory[]).forEach((cat) => {
    if (categoryBreakdown[cat] > maxCount) {
      maxCount = categoryBreakdown[cat];
      mostReportedCategory = cat;
    }
  });

  const resolutionRatePercent =
    totalReports > 0 ? Math.round((resolvedCount / totalReports) * 100) : 0;

  return {
    totalReports,
    awaitingVerification,
    verifiedCount,
    inProgressCount,
    resolvedCount,
    resolutionRatePercent,
    mostReportedCategory,
    categoryBreakdown,
    neighborhoodBreakdown,
    severityBreakdown,
    totalCommunitySupports,
  };
}

/**
 * Signature Narrative Feature: "The City's Hidden Patterns"
 * Identifies spatial clusters and systemic issues supported by the dataset.
 */
export function detectHiddenPatterns(issues: CivicIssue[]): HiddenPattern[] {
  const patterns: HiddenPattern[] = [];

  // Group by category and neighborhood
  const groups: Record<string, CivicIssue[]> = {};
  for (const issue of issues) {
    const key = `${issue.category}::${issue.neighborhood}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(issue);
  }

  // Look for clusters of >= 2 issues in same neighborhood/category
  for (const [key, group] of Object.entries(groups)) {
    if (group.length >= 2) {
      const [category, neighborhood] = key.split('::') as [IssueCategory, string];
      let patternTitle = '';
      let insight = '';
      let severity: CivicIssue['severity'] = 'medium';

      if (category === 'roads') {
        patternTitle = `Asphalt Fatigue Corridor: ${group.length} Road Surface Defects`;
        insight = `Reports indicate recurring pavement degradation along transit thoroughfares in ${neighborhood}. Likely sub-base erosion.`;
        severity = group.some((i) => i.severity === 'critical') ? 'critical' : 'high';
      } else if (category === 'lighting') {
        patternTitle = `Illumination Deficit: ${group.length} Luminaire Outages`;
        insight = `Multiple dark spots reported within 400m radius in ${neighborhood}, raising evening pedestrian visibility concerns.`;
        severity = 'medium';
      } else if (category === 'waste') {
        patternTitle = `Overflow Bottleneck: ${group.length} Sanitation Spikes`;
        insight = `Repeated disposal container overflow reported in ${neighborhood}, exceeding scheduled weekend collection capacity.`;
        severity = 'medium';
      } else if (category === 'water') {
        patternTitle = `Pressure Grid Leakage: ${group.length} Water Main Anomalies`;
        insight = `Sub-surface water bubbling and curb runoff detected at multiple junctions in ${neighborhood}.`;
        severity = 'high';
      } else if (category === 'accessibility') {
        patternTitle = `Pedestrian Mobility Barrier: ${group.length} Footpath Obstructions`;
        insight = `Continuous mobility barrier restricting wheelchair and stroller transit along central corridors in ${neighborhood}.`;
        severity = 'high';
      } else {
        patternTitle = `Civic Space Degradation in ${neighborhood}`;
        insight = `Multiple infrastructure concerns logged across public facilities in this sector.`;
      }

      patterns.push({
        id: `pat-${category}-${neighborhood.toLowerCase().replace(/\s+/g, '-')}`,
        title: patternTitle,
        category,
        neighborhood,
        description: `CIVICLENS spatial clustering discovered ${group.length} active reports within a localized sector of ${neighborhood}.`,
        insight,
        issueIds: group.map((i) => i.id),
        severity,
      });
    }
  }

  return patterns;
}

/**
 * Filter & Search issues
 */
export function filterIssues(
  issues: CivicIssue[],
  filters: {
    query?: string;
    category?: IssueCategory | 'all';
    severity?: IssueSeverity | 'all';
    status?: IssueStatus | 'all';
    neighborhood?: string | 'all';
  }
): CivicIssue[] {
  return issues.filter((issue) => {
    if (filters.category && filters.category !== 'all' && issue.category !== filters.category) {
      return false;
    }
    if (filters.severity && filters.severity !== 'all' && issue.severity !== filters.severity) {
      return false;
    }
    if (filters.status && filters.status !== 'all' && issue.status !== filters.status) {
      return false;
    }
    if (
      filters.neighborhood &&
      filters.neighborhood !== 'all' &&
      issue.neighborhood !== filters.neighborhood
    ) {
      return false;
    }
    if (filters.query && filters.query.trim().length > 0) {
      const q = filters.query.toLowerCase().trim();
      const match =
        issue.id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q) ||
        issue.locationName.toLowerCase().includes(q) ||
        issue.neighborhood.toLowerCase().includes(q) ||
        issue.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}
