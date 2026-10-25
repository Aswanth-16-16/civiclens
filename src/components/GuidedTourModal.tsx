import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { 
  Sparkles, 
  MapPin, 
  Camera, 
  Radar, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { GlowButton } from './GlowButton';

export interface TourStep {
  title: string;
  tagline: string;
  description: string;
  pillar: string;
  icon: React.ElementType;
  accentColor: string;
  actionLabel: string;
  actionTab: 'overview' | 'map' | 'report' | 'impact';
  details: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to CIVICLENS',
    tagline: 'Transforming citizen reports into verified municipal intelligence',
    description:
      'CIVICLENS bridges the gap between resident complaints and accountable infrastructure outcomes. Built for competition-level execution, it combines computer vision classification, spatial duplicate radar, and cryptographic-style audit trails.',
    pillar: 'PILLAR 1 · EXECUTIVE OVERVIEW',
    icon: Sparkles,
    accentColor: '#42E8F5',
    actionLabel: 'Explore City Radar',
    actionTab: 'overview',
    details: [
      'Nighttime urban intelligence visual direction with high contrast',
      'End-to-end transparent workflow with zero simulated bureaucracy claims',
      'Preserved local persistence with instant seed reset capability',
    ],
  },
  {
    title: 'Interactive City Cartography',
    tagline: 'Geospatial incident mapping across 6 metropolitan sectors',
    description:
      'Explore live classified hazards with nighttime contrast tiles, heat density contours, and real-time category clustering. Click any pin to open full details or toggle heat density to pinpoint persistent hazard zones.',
    pillar: 'PILLAR 2 · URBAN CARTOGRAPHY',
    icon: MapPin,
    accentColor: '#42E8F5',
    actionLabel: 'Open City Map',
    actionTab: 'map',
    details: [
      'Interactive pins with hover halo pulse & real-time detail tooltips',
      'Heat density layer toggling for high-severity concentrations',
      'Live sector & category filtering with coordinates HUD',
    ],
  },
  {
    title: 'AI Civic Vision Scanner',
    tagline: 'Multimodal defect classification & automatic severity grading',
    description:
      'Upload a real infrastructure photo or choose a high-fidelity preset. The vision engine parses asphalt fractures, damaged luminaires, water mains, and sanitation spills, estimating category and drafting description text.',
    pillar: 'PILLAR 3 · MULTIMODAL AI',
    icon: Camera,
    accentColor: '#9580FF',
    actionLabel: 'Launch AI Scanner',
    actionTab: 'report',
    details: [
      'Step-by-step 5-stage submission flow with draft editing',
      'Instant heuristic classification fallback for offline reliability',
      'Automatic confidence scoring and municipal category taxonomy mapping',
    ],
  },
  {
    title: 'Duplicate Radar Detection',
    tagline: 'Preventing redundant municipal work orders via Haversine math',
    description:
      'Before submission, the radar computes Haversine spatial proximity across all existing reports within a 600m perimeter. If duplicates match, residents can endorse the existing ticket instead of fragmenting civic attention.',
    pillar: 'PILLAR 4 · PROXIMITY RADAR',
    icon: Radar,
    accentColor: '#FFBF69',
    actionLabel: 'Test Duplicate Radar',
    actionTab: 'report',
    details: [
      'Pure mathematical Haversine distance calculations verified with unit tests',
      'Lexical similarity checks on defect title and description',
      'One-click support & merge action preserving citizen consensus',
    ],
  },
  {
    title: 'Neighborhood Impact Lab',
    tagline: 'Spatio-temporal clustering and verified outcome analytics',
    description:
      'Analyze metropolitan resolution metrics, discover hidden infrastructure decay patterns, and jump directly from statistical charts into filtered map views.',
    pillar: 'PILLAR 5 · METROPOLITAN IMPACT',
    icon: Activity,
    accentColor: '#66E6B0',
    actionLabel: 'View Impact Lab',
    actionTab: 'impact',
    details: [
      'Dynamic resolution rates, active verification counts, and citizen votes',
      'Signature Spatio-Temporal Clustering algorithm detecting repeat failures',
      'Interactive chart bars that directly apply map filters upon click',
    ],
  },
];

export const GuidedTourModal: React.FC = () => {
  const { isTourOpen, setTourOpen, setActiveTab } = useCivic();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isTourOpen) return null;

  const step = TOUR_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      setTourOpen(false);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleJumpToFeature = () => {
    setActiveTab(step.actionTab);
    setTourOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="CivicLens Guided Walkthrough"
      onClick={() => setTourOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-[#0C1320] border border-[rgba(160,190,220,0.2)] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(66,232,245,0.15)] p-6 sm:p-8 space-y-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background ambient radial highlight */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: step.accentColor }}
        />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(160,190,220,0.14)] relative">
          <div className="flex items-center gap-2">
            <span 
              className="text-xs font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border"
              style={{
                color: step.accentColor,
                backgroundColor: `${step.accentColor}15`,
                borderColor: `${step.accentColor}40`,
              }}
            >
              {step.pillar}
            </span>
          </div>

          <button
            onClick={() => setTourOpen(false)}
            className="p-1 rounded-lg text-[#A6B4C8] hover:text-[#F4F7FC] hover:bg-[#121C2B] transition-colors cursor-pointer"
            aria-label="Close walkthrough"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-between gap-2">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStepIndex(idx)}
              className="flex-1 h-1.5 rounded-full transition-all cursor-pointer"
              style={{
                backgroundColor:
                  idx === currentStepIndex
                    ? step.accentColor
                    : idx < currentStepIndex
                    ? 'rgba(66,232,245,0.4)'
                    : 'rgba(160,190,220,0.14)',
                boxShadow: idx === currentStepIndex ? `0 0 8px ${step.accentColor}` : 'none',
              }}
              title={s.title}
              aria-label={`Jump to ${s.title}`}
            />
          ))}
        </div>

        {/* Main Content Body */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-lg"
              style={{
                backgroundColor: '#121C2B',
                borderColor: `${step.accentColor}50`,
                color: step.accentColor,
                boxShadow: `0 0 16px ${step.accentColor}25`,
              }}
            >
              <step.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#F4F7FC]">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-[#A6B4C8] mt-0.5">
                {step.tagline}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#A6B4C8] leading-relaxed">
            {step.description}
          </p>

          {/* Key Feature Checkpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {step.details.map((detail, idx) => (
              <div 
                key={idx} 
                className="p-2.5 rounded-lg bg-[#121C2B] border border-[rgba(160,190,220,0.12)] flex items-start gap-2 text-[11px] text-[#F4F7FC]"
              >
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: step.accentColor }} />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="pt-4 border-t border-[rgba(160,190,220,0.14)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-[#A6B4C8] hover:text-[#F4F7FC] hover:bg-[#121C2B] border border-[rgba(160,190,220,0.14)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}
            <span className="text-[11px] font-mono text-[#A6B4C8]">
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleJumpToFeature}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#42E8F5] bg-[#42E8F5]/10 border border-[#42E8F5]/30 hover:bg-[#42E8F5]/20 hover:border-[#42E8F5] transition-all cursor-pointer"
            >
              <span>{step.actionLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <GlowButton
              variant="primary"
              size="sm"
              onClick={handleNext}
              icon={isLast ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              {isLast ? 'Complete Tour' : 'Next Pillar'}
            </GlowButton>
          </div>
        </div>
      </div>
    </div>
  );
};
