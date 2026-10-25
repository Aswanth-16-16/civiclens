import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useCivic } from '../context/CivicContext';
import { SAMPLE_SCAN_PRESETS } from '../data/seedIssues';
import { detectDuplicateCandidates, DuplicateMatchResult } from '../utils/civicLogic';
import { analyzeCivicImage } from '../utils/geminiVision';
import { IssueCategory, IssueSeverity } from '../types/civic';
import { GlowButton } from './GlowButton';
import { 
  Upload, 
  Sparkles, 
  MapPin, 
  Radar, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  ThumbsUp, 
  AlertTriangle,
  RefreshCw,
  LocateFixed,
  Eye,
  ShieldCheck,
  Check
} from 'lucide-react';

export const AIReportWizard: React.FC = () => {
  const { issues, submitNewReport, openDetail, setActiveTab, supportIssue } = useCivic();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  
  // AI Scan states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('Initializing CivicLens Vision Model...');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('roads');
  const [severity, setSeverity] = useState<IssueSeverity>('medium');
  const [confidence, setConfidence] = useState<number>(0.92);

  // Location states
  const [locationName, setLocationName] = useState('400 Market Street');
  const [neighborhood, setNeighborhood] = useState('Downtown Core');
  const [coordinates, setCoordinates] = useState({ lat: 37.7749, lng: -122.4194 });
  const [locatingUser, setLocatingUser] = useState(false);

  // Duplicate Radar candidates
  const [duplicates, setDuplicates] = useState<DuplicateMatchResult[]>([]);

  // Submission result
  const [submittedIssueId, setSubmittedIssueId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file (PNG, JPG, WebP).');
        return;
      }
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Choose a pre-loaded sample
  const handleSelectSample = (preset: typeof SAMPLE_SCAN_PRESETS[number]) => {
    setSelectedImage(preset.imageUrl);
    setImageFileName(preset.name);
    setTitle(preset.title);
    setDescription(preset.description);
    setCategory(preset.category);
    setSeverity(preset.severity);
    setLocationName(preset.locationName);
    setNeighborhood(preset.neighborhood);
    setCoordinates(preset.coordinates);
    setConfidence(preset.confidence);
  };

  // Run AI Scan
  const handleStartScan = async () => {
    if (!selectedImage) return;
    setStep(2);
    setIsScanning(true);
    setScanProgress(15);
    setScanMessage('Calibrating geometric contours & road surface features...');

    setTimeout(() => {
      setScanProgress(45);
      setScanMessage('Cross-referencing municipal infrastructure taxonomy...');
    }, 600);

    setTimeout(() => {
      setScanProgress(80);
      setScanMessage('Synthesizing structured title & severity grade...');
    }, 1200);

    const analysis = await analyzeCivicImage(selectedImage, imageFileName);

    setTimeout(() => {
      setTitle(analysis.title);
      setDescription(analysis.description);
      setCategory(analysis.category);
      setSeverity(analysis.severity);
      setConfidence(analysis.confidence);
      setScanProgress(100);
      setIsScanning(false);
    }, 1800);
  };

  // Step 3 to 4: Check duplicate radar
  const handleProceedToDuplicateCheck = () => {
    if (!title.trim() || !description.trim()) {
      alert('Please provide a title and description before proceeding.');
      return;
    }
    const matches = detectDuplicateCandidates(
      {
        coordinates,
        category,
        title,
        description,
      },
      issues,
      600
    );
    setDuplicates(matches);
    setStep(4);
  };

  // Handle Geolocation with explicit consent
  const handleRequestGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordinates({
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
        });
        setLocationName('Detected Browser Location');
        setLocatingUser(false);
      },
      () => {
        setLocatingUser(false);
        alert('Could not determine exact location. Defaulting to municipal grid.');
      },
      { timeout: 8000 }
    );
  };

  // Final Submit
  const handleFinalSubmit = () => {
    if (!selectedImage) return;

    const created = submitNewReport({
      title: title.trim(),
      description: description.trim(),
      category,
      severity,
      status: 'awaiting_verification',
      coordinates,
      locationName,
      neighborhood,
      imageUrl: selectedImage,
      aiSuggested: true,
      aiConfidence: confidence,
    });

    setSubmittedIssueId(created.id);
    
    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#42E8F5', '#9580FF', '#66E6B0'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Step Indicator Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-mono font-bold text-[#42E8F5] uppercase tracking-wider">
              AI Issue Scanner & Reporter
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F7FC] mt-0.5">
              File a Neighborhood Report
            </h2>
          </div>
          <span className="text-xs font-mono text-[#A6B4C8] bg-[#0C1320] px-3 py-1.5 rounded-lg border border-[rgba(160,190,220,0.14)]">
            STEP {step} OF 5
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#0C1320] rounded-full overflow-hidden border border-[rgba(160,190,220,0.14)]">
          <div 
            className="h-full bg-gradient-to-r from-[#42E8F5] to-[#9580FF] transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: CAPTURE */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-[#121C2B] border border-[rgba(160,190,220,0.14)] rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-[#F4F7FC] mb-1">
              Step 1: Capture or Select Problem Image
            </h3>
            <p className="text-xs text-[#A6B4C8] mb-6">
              Upload a photograph of a street defect, damaged crossing, waste overflow, or infrastructure hazard.
            </p>

            {/* Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                selectedImage
                  ? 'border-[#42E8F5] bg-[#42E8F5]/5'
                  : 'border-[rgba(160,190,220,0.2)] hover:border-[#42E8F5]/40 bg-[#080D16]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Upload civic defect photo"
              />

              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative max-w-sm mx-auto aspect-video rounded-lg overflow-hidden border border-[rgba(160,190,220,0.14)]">
                    <img
                      src={selectedImage}
                      alt="Selected defect"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#42E8F5] font-mono">
                    Image ready for AI scanning: {imageFileName || 'Uploaded Photo'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#0C1320] border border-[rgba(160,190,220,0.14)] flex items-center justify-center mx-auto text-[#42E8F5]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F4F7FC]">Click or drag & drop photo here</p>
                    <p className="text-xs text-[#A6B4C8] mt-0.5">Supports PNG, JPG, WebP up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Presets Gallery */}
            <div className="mt-8 pt-6 border-t border-[rgba(160,190,220,0.14)]">
              <span className="text-xs font-mono text-[#A6B4C8] block mb-3 uppercase">
                Or select a demonstration scenario:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {SAMPLE_SCAN_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectSample(preset)}
                    className="p-2.5 rounded-xl bg-[#0C1320] hover:bg-[#192638] border border-[rgba(160,190,220,0.14)] hover:border-[#42E8F5]/40 text-left transition-all group"
                  >
                    <div className="aspect-video rounded-lg overflow-hidden bg-[#080D16] mb-2 border border-[rgba(160,190,220,0.1)]">
                      <img
                        src={preset.imageUrl}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#F4F7FC] block truncate">
                      {preset.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#A6B4C8] capitalize">
                      {preset.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end">
            <GlowButton
              variant="primary"
              size="md"
              onClick={handleStartScan}
              disabled={!selectedImage}
              icon={<Sparkles className="w-4 h-4 text-[#080D16]" />}
            >
              <span>Launch AI Issue Scanner</span>
              <ArrowRight className="w-4 h-4 ml-1 inline" />
            </GlowButton>
          </div>
        </div>
      )}

      {/* STEP 2: AI SCAN & REVIEW */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-[#121C2B] border border-[rgba(160,190,220,0.14)] rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-[#F4F7FC] mb-1">
              Step 2: Civic Lens AI Analysis
            </h3>
            <p className="text-xs text-[#A6B4C8] mb-6">
              Our vision engine classifies the defect and suggests standardized descriptions. You retain complete editorial control.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Photo Scanning Frame */}
              <div className="md:col-span-5 relative aspect-square rounded-xl overflow-hidden border border-[rgba(160,190,220,0.18)] bg-[#080D16]">
                <img
                  src={selectedImage!}
                  alt="Scanning issue"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Animated Scanning Laser with Cyan & Violet */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-1 bg-gradient-to-r from-[#42E8F5] to-[#9580FF] shadow-[0_0_15px_#42E8F5] animate-[pulse_1.5s_ease-in-out_infinite]" />
                    <div className="absolute inset-0 bg-[#42E8F5]/10 backdrop-blur-[0.5px]" />
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-lg bg-[#080D16]/90 backdrop-blur-sm text-[11px] font-mono border border-[rgba(160,190,220,0.14)]">
                  <div className="flex items-center justify-between text-[#42E8F5]">
                    <span>STATUS</span>
                    <span>{isScanning ? `${scanProgress}%` : 'COMPLETE'}</span>
                  </div>
                  <p className="text-[#F4F7FC] truncate mt-0.5">{scanMessage}</p>
                </div>
              </div>

              {/* Editable Suggested Fields */}
              <div className="md:col-span-7 space-y-4">
                {/* Confidence Badge */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0C1320] border border-[rgba(160,190,220,0.14)] text-xs">
                  <div className="flex items-center gap-1.5 text-[#42E8F5] font-mono">
                    <Sparkles className="w-4 h-4 text-[#9580FF]" />
                    <span>AI Confidence: {Math.round(confidence * 100)}%</span>
                  </div>
                  <span className="text-[#A6B4C8] font-mono text-[11px]">Taxonomy Match: High</span>
                </div>

                {/* Category Select */}
                <div>
                  <label className="text-xs font-mono text-[#A6B4C8] block mb-1">
                    ISSUE CATEGORY
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IssueCategory)}
                    className="w-full bg-[#0C1320] border border-[rgba(160,190,220,0.14)] focus:border-[#42E8F5] rounded-lg px-3 py-2 text-sm text-[#F4F7FC] focus:outline-none"
                  >
                    <option value="roads">Roads & Potholes</option>
                    <option value="waste">Sanitation & Garbage Overflow</option>
                    <option value="lighting">Streetlights & Darkness Hazards</option>
                    <option value="water">Water Leak & Storm Drainage</option>
                    <option value="accessibility">Accessibility & Curb Ramp Obstruction</option>
                    <option value="public_spaces">Public Spaces & Park Maintenance</option>
                  </select>
                </div>

                {/* Severity Select */}
                <div>
                  <label className="text-xs font-mono text-[#A6B4C8] block mb-1">
                    SEVERITY LEVEL
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['low', 'medium', 'high', 'critical'] as IssueSeverity[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSeverity(lvl)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-mono capitalize transition-all border ${
                          severity === lvl
                            ? 'bg-[#42E8F5]/15 text-[#42E8F5] border-[#42E8F5] font-bold'
                            : 'bg-[#0C1320] text-[#A6B4C8] border-[rgba(160,190,220,0.14)] hover:text-[#F4F7FC]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="text-xs font-mono text-[#A6B4C8] block mb-1">
                    REPORT TITLE
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#0C1320] border border-[rgba(160,190,220,0.14)] focus:border-[#42E8F5] rounded-lg px-3 py-2 text-sm text-[#F4F7FC] focus:outline-none"
                    placeholder="Clear summary of the problem"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="text-xs font-mono text-[#A6B4C8] block mb-1">
                    DETAILED DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0C1320] border border-[rgba(160,190,220,0.14)] focus:border-[#42E8F5] rounded-lg px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
                    placeholder="Describe size, depth, hazards to pedestrians or vehicles..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs text-[#A6B4C8] hover:text-[#F4F7FC]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Photo</span>
            </button>

            <button
              onClick={() => setStep(3)}
              disabled={isScanning}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#42E8F5] hover:bg-[#5CF0FD] text-[#080D16] font-bold text-sm hover:glow-cyan-sm shadow-md shadow-[#42E8F5]/25 transition-all"
            >
              <span>Confirm Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRM LOCATION */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-[#121C2B] border border-[rgba(160,190,220,0.14)] rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#F4F7FC] mb-1">
                Step 3: Confirm Location
              </h3>
              <p className="text-xs text-[#A6B4C8]">
                Accurate coordinates enable our duplicate radar to correlate your report with neighboring entries.
              </p>
            </div>

            {/* Geolocation Button */}
            <div className="p-4 rounded-xl bg-[#0C1320] border border-[rgba(160,190,220,0.14)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#F4F7FC] block">Auto-detect from device</span>
                <span className="text-[11px] text-[#A6B4C8]">
                  Requires one-time browser permission. No background tracking.
                </span>
              </div>
              <button
                onClick={handleRequestGeolocation}
                disabled={locatingUser}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#080D16] hover:bg-[#192638] border border-[#42E8F5]/40 text-xs font-mono text-[#42E8F5] transition-colors whitespace-nowrap"
              >
                <LocateFixed className={`w-3.5 h-3.5 ${locatingUser ? 'animate-spin' : ''}`} />
                <span>{locatingUser ? 'Detecting...' : 'Use My Geolocation'}</span>
              </button>
            </div>

            {/* Address & Neighborhood Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-[#A6B4C8] block mb-1">
                  STREET OR CROSSING
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-[#0C1320] border border-[rgba(160,190,220,0.14)] focus:border-[#42E8F5] rounded-lg px-3 py-2 text-sm text-[#F4F7FC] focus:outline-none"
                  placeholder="e.g. 500 Market St at 4th Ave"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#A6B4C8] block mb-1">
                  NEIGHBORHOOD SECTOR
                </label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-[#0C1320] border border-[rgba(160,190,220,0.14)] focus:border-[#42E8F5] rounded-lg px-3 py-2 text-sm text-[#F4F7FC] focus:outline-none"
                >
                  <option value="Downtown Core">Downtown Core</option>
                  <option value="East Riverside">East Riverside</option>
                  <option value="North Highlands">North Highlands</option>
                  <option value="Arts District">Arts District</option>
                  <option value="Harbourfront">Harbourfront</option>
                  <option value="Oakridge">Oakridge</option>
                </select>
              </div>
            </div>

            {/* Coordinates indicator */}
            <div className="p-3 rounded-lg bg-[#080D16] border border-[rgba(160,190,220,0.14)] flex items-center justify-between text-xs font-mono text-[#A6B4C8]">
              <span className="flex items-center gap-1.5 text-[#F4F7FC]">
                <MapPin className="w-3.5 h-3.5 text-[#42E8F5]" />
                <span>LAT: {coordinates.lat.toFixed(4)}° N, LON: {coordinates.lng.toFixed(4)}° W</span>
              </span>
              <span className="text-[#66E6B0] font-semibold">GEODATA CONFIRMED</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs text-[#A6B4C8] hover:text-[#F4F7FC]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Analysis</span>
            </button>

            <button
              onClick={handleProceedToDuplicateCheck}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#42E8F5] hover:bg-[#5CF0FD] text-[#080D16] font-bold text-sm hover:glow-cyan-sm shadow-md shadow-[#42E8F5]/25 transition-all"
            >
              <Radar className="w-4 h-4" />
              <span>Check Duplicate Radar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DUPLICATE RADAR */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-[#121C2B] border border-[rgba(160,190,220,0.14)] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#42E8F5] text-xs font-mono font-bold">
                  <Radar className="w-4 h-4 animate-spin text-[#42E8F5]" />
                  <span>DUPLICATE RADAR SYSTEM</span>
                </div>
                <h3 className="text-base font-bold text-[#F4F7FC] mt-0.5">
                  Proximity & Incident Correlation
                </h3>
              </div>
              <span className="text-xs font-mono text-[#A6B4C8]">
                {duplicates.length} Matches Found
              </span>
            </div>

            {duplicates.length === 0 ? (
              <div className="p-6 text-center bg-[#0C1320] rounded-xl border border-[rgba(160,190,220,0.14)]">
                <CheckCircle2 className="w-8 h-8 text-[#66E6B0] mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-[#F4F7FC]">No Direct Duplicates Nearby</h4>
                <p className="text-xs text-[#A6B4C8] max-w-md mx-auto mt-1">
                  Radar verified that no active report matches this category within a 600m radius of your coordinates. Your submission will establish a new incident node.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-[#A6B4C8]">
                  We discovered existing reports close to your coordinates. You can support an existing report to amplify its priority, or file a distinct issue.
                </p>

                {duplicates.slice(0, 3).map((match) => (
                  <div
                    key={match.issue.id}
                    className="p-4 rounded-xl bg-[#0C1320] border border-[rgba(160,190,220,0.14)] hover:border-[#42E8F5]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-[#42E8F5] font-bold">{match.issue.id}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-[#FFBF69]">{match.matchReason}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-[#A6B4C8]">{match.similarityScore}% match</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#F4F7FC]">{match.issue.title}</h4>
                      <p className="text-xs text-[#A6B4C8] line-clamp-1">{match.issue.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          supportIssue(match.issue.id);
                          openDetail(match.issue.id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#42E8F5]/10 text-[#42E8F5] border border-[#42E8F5]/30 text-xs font-semibold hover:bg-[#42E8F5]/20 transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Support Existing</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs text-[#A6B4C8] hover:text-[#F4F7FC]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Location</span>
            </button>

            <button
              onClick={() => setStep(5)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#42E8F5] hover:bg-[#5CF0FD] text-[#080D16] font-bold text-sm hover:glow-cyan-sm shadow-md shadow-[#42E8F5]/25 transition-all"
            >
              <span>Review & Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & FINAL SUBMISSION */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="bg-[#121C2B] border border-[rgba(160,190,220,0.14)] rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#F4F7FC] mb-1">
                Step 5: Review & Broadcast Report
              </h3>
              <p className="text-xs text-[#A6B4C8]">
                Please verify details before publishing to the civic intelligence repository.
              </p>
            </div>

            {submittedIssueId ? (
              /* Success Confirmation */
              <div className="p-8 text-center bg-[#080D16] rounded-xl border border-[#66E6B0]/40 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#66E6B0]/20 text-[#66E6B0] flex items-center justify-center mx-auto border border-[#66E6B0]">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-[#66E6B0]">
                    REPORT BROADCAST CONFIRMED
                  </span>
                  <h4 className="text-xl font-extrabold text-[#F4F7FC] mt-1">
                    {submittedIssueId} is Now Live
                  </h4>
                  <p className="text-xs text-[#A6B4C8] max-w-md mx-auto mt-1">
                    Your report has been logged to the local demonstration store and pinned to the City Map with an initial verification status.
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => openDetail(submittedIssueId)}
                    className="px-5 py-2.5 rounded-lg bg-[#42E8F5] hover:bg-[#5CF0FD] text-[#080D16] font-bold text-xs hover:glow-cyan-sm transition-colors"
                  >
                    View My Report
                  </button>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="px-5 py-2.5 rounded-lg bg-[#0C1320] text-[#F4F7FC] border border-[rgba(160,190,220,0.14)] hover:border-[#42E8F5]/40 font-semibold text-xs transition-colors"
                  >
                    Locate on City Map
                  </button>
                </div>
              </div>
            ) : (
              /* Review Summary Card */
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-[#0C1320] border border-[rgba(160,190,220,0.14)] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-4 aspect-video rounded-lg overflow-hidden border border-[rgba(160,190,220,0.14)]">
                    <img
                      src={selectedImage!}
                      alt={title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="md:col-span-8 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#42E8F5]/10 text-[#42E8F5] capitalize font-bold">
                        {category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#FFBF69]/10 text-[#FFBF69] capitalize font-bold">
                        {severity} Severity
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#F4F7FC]">{title}</h4>
                    <p className="text-[#A6B4C8] leading-relaxed">{description}</p>
                    <div className="flex items-center gap-1.5 text-[#A6B4C8] pt-2 border-t border-[rgba(160,190,220,0.14)]">
                      <MapPin className="w-3.5 h-3.5 text-[#42E8F5]" />
                      <span>{locationName} · {neighborhood}</span>
                    </div>
                  </div>
                </div>

                {/* Transparency Disclaimer */}
                <div className="p-3 rounded-lg bg-[#080D16] border border-[rgba(160,190,220,0.14)] text-[11px] font-mono text-[#A6B4C8]">
                  <span className="text-[#FFBF69] font-bold">NOTE: </span>
                  Demonstration submission saves locally and simulates civic workflow progression without contacting municipal emergency authorities.
                </div>
              </div>
            )}
          </div>

          {/* Navigation / Submit Action */}
          {!submittedIssueId && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs text-[#A6B4C8] hover:text-[#F4F7FC]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Radar</span>
              </button>

              <GlowButton
                variant="primary"
                size="lg"
                onClick={handleFinalSubmit}
                icon={<CheckCircle2 className="w-5 h-5 stroke-[2.5]" />}
              >
                Broadcast Report to City
              </GlowButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
