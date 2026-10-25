import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDistanceMeters,
  detectDuplicateCandidates,
  calculateCityMetrics,
  detectHiddenPatterns,
  filterIssues,
} from './civicLogic';
import { CivicIssue } from '../types/civic';

const mockIssues: CivicIssue[] = [
  {
    id: 'CVL-2026-0001',
    title: 'Severe Pothole on Market St',
    description: 'Deep road cavity causing vehicle suspension damage',
    category: 'roads',
    severity: 'critical',
    status: 'awaiting_verification',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    locationName: '400 Market Street',
    neighborhood: 'Downtown Core',
    createdAt: '2026-10-20T10:00:00Z',
    updatedAt: '2026-10-20T10:00:00Z',
    supports: 14,
    imageUrl: '',
    timeline: [],
    comments: [],
    isDemo: true,
  },
  {
    id: 'CVL-2026-0002',
    title: 'Broken Pavement Hole',
    description: 'Dangerous pothole near the bike lane on Market St',
    category: 'roads',
    severity: 'high',
    status: 'verified',
    coordinates: { lat: 37.7751, lng: -122.4192 }, // ~28m away
    locationName: '420 Market Street',
    neighborhood: 'Downtown Core',
    createdAt: '2026-10-21T11:00:00Z',
    updatedAt: '2026-10-21T11:00:00Z',
    supports: 8,
    imageUrl: '',
    timeline: [],
    comments: [],
    isDemo: true,
  },
  {
    id: 'CVL-2026-0003',
    title: 'Overflowing Trash Bins',
    description: 'Cardboard boxes and waste accumulating on sidewalk',
    category: 'waste',
    severity: 'medium',
    status: 'resolved',
    coordinates: { lat: 37.7800, lng: -122.4100 },
    locationName: '800 Riverside Drive',
    neighborhood: 'East Riverside',
    createdAt: '2026-10-18T09:00:00Z',
    updatedAt: '2026-10-22T14:00:00Z',
    supports: 22,
    imageUrl: '',
    timeline: [],
    comments: [],
    isDemo: true,
  },
  {
    id: 'CVL-2026-0004',
    title: 'Unlit Streetlight Fixture',
    description: 'Streetlight dark at pedestrian crossing',
    category: 'lighting',
    severity: 'high',
    status: 'forwarded_to_authority',
    coordinates: { lat: 37.7850, lng: -122.4200 },
    locationName: '120 Highland Ave',
    neighborhood: 'North Highlands',
    createdAt: '2026-10-19T20:00:00Z',
    updatedAt: '2026-10-21T08:00:00Z',
    supports: 5,
    imageUrl: '',
    timeline: [],
    comments: [],
    isDemo: true,
  },
];

test('calculateDistanceMeters computes accurate Haversine distance', () => {
  // Distance between identical coordinates is 0
  const distZero = calculateDistanceMeters(37.7749, -122.4194, 37.7749, -122.4194);
  assert.equal(distZero, 0);

  // Distance between 37.7749,-122.4194 and 37.7751,-122.4192 is approximately 28 meters
  const dist = calculateDistanceMeters(37.7749, -122.4194, 37.7751, -122.4192);
  assert.ok(dist > 20 && dist < 35, `Expected ~28m, got ${dist}`);
});

test('detectDuplicateCandidates catches nearby same-category reports on Duplicate Radar', () => {
  const candidate = {
    coordinates: { lat: 37.7750, lng: -122.4193 },
    category: 'roads' as const,
    title: 'Big pothole on road',
    description: 'Car wheel damage risk on Market Street',
  };

  const matches = detectDuplicateCandidates(candidate, mockIssues, 600);
  assert.ok(matches.length >= 2, `Expected at least 2 road matches, got ${matches.length}`);
  // Should have high similarity score
  assert.ok(matches[0].similarityScore >= 60);
  assert.ok(matches[0].distanceMeters < 50);
});

test('calculateCityMetrics aggregates real metrics from current issue set', () => {
  const metrics = calculateCityMetrics(mockIssues);
  assert.equal(metrics.totalReports, 4);
  assert.equal(metrics.awaitingVerification, 1);
  assert.equal(metrics.verifiedCount, 1);
  assert.equal(metrics.inProgressCount, 1);
  assert.equal(metrics.resolvedCount, 1);
  assert.equal(metrics.resolutionRatePercent, 25);
  assert.equal(metrics.mostReportedCategory, 'roads');
  assert.equal(metrics.categoryBreakdown.roads, 2);
  assert.equal(metrics.totalCommunitySupports, 49);
});

test('detectHiddenPatterns finds spatial & category clusters', () => {
  const patterns = detectHiddenPatterns(mockIssues);
  // There are 2 'roads' issues in 'Downtown Core'
  const roadPattern = patterns.find((p) => p.category === 'roads' && p.neighborhood === 'Downtown Core');
  assert.ok(roadPattern, 'Expected cluster pattern for roads in Downtown Core');
  assert.equal(roadPattern.issueIds.length, 2);
});

test('filterIssues filters correctly by category, status, and query', () => {
  const roadIssues = filterIssues(mockIssues, { category: 'roads' });
  assert.equal(roadIssues.length, 2);

  const queryMatch = filterIssues(mockIssues, { query: 'Market St' });
  assert.equal(queryMatch.length, 2);

  const resolvedOnly = filterIssues(mockIssues, { status: 'resolved' });
  assert.equal(resolvedOnly.length, 1);
  assert.equal(resolvedOnly[0].id, 'CVL-2026-0003');
});
