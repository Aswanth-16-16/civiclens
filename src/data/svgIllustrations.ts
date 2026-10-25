/**
 * Vector illustrations for civic defects and resolutions.
 * Rendered as data URIs aligned to the CIVICLENS futuristic color system:
 * - Backgrounds: #080D16, #0C1320
 * - Surfaces: #121C2B, #192638
 * - Accents: Cyan #42E8F5, Violet #9580FF
 * - Signals: Warning #FFBF69, Error #FF6B78, Success #66E6B0
 */

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const civicSVGs = {
  // Pothole - Before (Dangerous road crater)
  potholeBefore: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <radialGradient id="potholeCavity" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#05080E" />
          <stop offset="70%" stop-color="#121C2B" />
          <stop offset="100%" stop-color="#192638" />
        </radialGradient>
        <linearGradient id="roadBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#162334" />
          <stop offset="100%" stop-color="#0C1320" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#roadBase)" />
      <!-- Road texture markings -->
      <line x1="0" y1="300" x2="800" y2="300" stroke="#FFBF69" stroke-width="8" stroke-dasharray="40 30" opacity="0.65" />
      <line x1="50" y1="120" x2="750" y2="120" stroke="#F4F7FC" stroke-width="4" opacity="0.14" />
      <line x1="50" y1="480" x2="750" y2="480" stroke="#F4F7FC" stroke-width="4" opacity="0.14" />
      
      <!-- Pothole Crater Outer Fracture -->
      <path d="M 280 230 Q 380 180 520 220 T 610 320 Q 590 410 470 430 T 260 380 Q 210 300 280 230 Z" fill="#0C1320" stroke="rgba(160,190,220,0.22)" stroke-width="3" />
      <!-- Cavity Depth -->
      <ellipse cx="430" cy="320" rx="160" ry="90" fill="url(#potholeCavity)" />
      <!-- Jagged stone aggregates inside -->
      <polygon points="340,300 360,285 375,305 350,315" fill="#475569" />
      <polygon points="460,330 490,320 500,345 470,350" fill="#64748B" />
      <polygon points="410,340 435,325 440,355 415,360" fill="#334155" />
      <polygon points="310,340 330,330 335,350 315,355" fill="#475569" />
      <!-- Water puddle reflection in cavity -->
      <ellipse cx="440" cy="335" rx="70" ry="30" fill="#42E8F5" opacity="0.25" />
      
      <!-- Measurement overlay badge -->
      <rect x="40" y="40" width="220" height="44" rx="8" fill="#080D16" fill-opacity="0.9" stroke="#FFBF69" stroke-width="1.5" />
      <text x="60" y="68" fill="#FFBF69" font-family="monospace" font-size="14" font-weight="bold">DEPTH: 8.5cm / CRITICAL</text>
    </svg>
  `),

  // Pothole - After (Cleanly Repaired Asphalt)
  potholeAfter: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <linearGradient id="roadBaseAfter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#162334" />
          <stop offset="100%" stop-color="#0C1320" />
        </linearGradient>
        <linearGradient id="freshPatch" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#192638" />
          <stop offset="100%" stop-color="#0C1320" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#roadBaseAfter)" />
      <!-- Road markings -->
      <line x1="0" y1="300" x2="800" y2="300" stroke="#FFBF69" stroke-width="8" stroke-dasharray="40 30" opacity="0.65" />
      
      <!-- Fresh rectangular engineered patch -->
      <rect x="230" y="190" width="400" height="260" rx="6" fill="url(#freshPatch)" stroke="#66E6B0" stroke-width="2" />
      <!-- Fresh bitumen seal lines -->
      <rect x="226" y="186" width="408" height="268" rx="8" fill="none" stroke="#080D16" stroke-width="4" opacity="0.75" />
      <line x1="230" y1="300" x2="630" y2="300" stroke="#FFBF69" stroke-width="8" stroke-dasharray="40 30" opacity="0.9" />
      
      <!-- Repaired verified badge -->
      <rect x="40" y="40" width="240" height="44" rx="8" fill="#080D16" fill-opacity="0.9" stroke="#66E6B0" stroke-width="1.5" />
      <text x="60" y="68" fill="#66E6B0" font-family="monospace" font-size="14" font-weight="bold">SURFACE RESTORED / RESOLVED</text>
    </svg>
  `),

  // Waste Overflow - Before
  wasteBefore: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#0C1320" />
      <!-- Pavement tiles -->
      <pattern id="sidewalk" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(160,190,220,0.12)" stroke-width="1.5" />
      </pattern>
      <rect width="800" height="600" fill="url(#sidewalk)" />
      <!-- Overfilled municipal bins -->
      <rect x="240" y="220" width="140" height="240" rx="10" fill="#121C2B" stroke="#42E8F5" stroke-width="2.5" />
      <rect x="410" y="240" width="140" height="220" rx="10" fill="#0B2B20" stroke="#66E6B0" stroke-width="2.5" />
      <!-- Open Lids pushed open -->
      <polygon points="230,220 380,180 390,200 240,240" fill="#192638" />
      <polygon points="400,240 550,200 560,220 410,260" fill="#123B2D" />
      <!-- Spilling trash bags & boxes -->
      <ellipse cx="320" cy="180" rx="55" ry="35" fill="#334155" />
      <ellipse cx="360" cy="200" rx="45" ry="30" fill="#475569" />
      <rect x="220" y="440" width="110" height="70" rx="4" fill="#78350F" transform="rotate(-8 275 475)" />
      <rect x="330" y="450" width="90" height="65" rx="4" fill="#92400E" transform="rotate(12 375 480)" />
      <ellipse cx="480" cy="460" rx="60" ry="30" fill="#192638" />
      <!-- Spill warning label -->
      <rect x="40" y="40" width="220" height="44" rx="8" fill="#080D16" fill-opacity="0.9" stroke="#FFBF69" stroke-width="1.5" />
      <text x="60" y="68" fill="#FFBF69" font-family="monospace" font-size="14" font-weight="bold">OVERFLOW SPILL / HIGH</text>
    </svg>
  `),

  // Waste Overflow - After (Cleared & Sanitized)
  wasteAfter: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#0C1320" />
      <rect width="800" height="600" fill="url(#sidewalk)" />
      <!-- Clean bins with closed lids -->
      <rect x="240" y="240" width="140" height="240" rx="10" fill="#121C2B" stroke="#42E8F5" stroke-width="2.5" />
      <rect x="410" y="240" width="140" height="240" rx="10" fill="#0B2B20" stroke="#66E6B0" stroke-width="2.5" />
      <rect x="235" y="230" width="150" height="20" rx="4" fill="#192638" />
      <rect x="405" y="230" width="150" height="20" rx="4" fill="#123B2D" />
      <!-- Sanitized clean pavement floor -->
      <line x1="180" y1="490" x2="620" y2="490" stroke="#66E6B0" stroke-width="3" stroke-dasharray="10 10" opacity="0.6" />
      <!-- Cleared badge -->
      <rect x="40" y="40" width="230" height="44" rx="8" fill="#080D16" fill-opacity="0.9" stroke="#66E6B0" stroke-width="1.5" />
      <text x="60" y="68" fill="#66E6B0" font-family="monospace" font-size="14" font-weight="bold">SITE CLEARED / RESOLVED</text>
    </svg>
  `),

  // Streetlight Outage
  streetlightDark: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#080D16" />
      <!-- Night sky & ambient horizon -->
      <circle cx="680" cy="100" r="30" fill="#A6B4C8" opacity="0.15" />
      <!-- Lamp Post -->
      <path d="M 380 550 L 380 200 Q 380 120 460 120 L 500 120" fill="none" stroke="#192638" stroke-width="12" stroke-linecap="round" />
      <polygon points="490,120 540,140 520,160 480,135" fill="#121C2B" stroke="rgba(160,190,220,0.18)" stroke-width="2" />
      <!-- Dark Luminaire - Red X indicator -->
      <circle cx="510" cy="150" r="16" fill="#3B151C" stroke="#FF6B78" stroke-width="2" />
      <line x1="502" y1="142" x2="518" y2="158" stroke="#F4F7FC" stroke-width="3" />
      <line x1="518" y1="142" x2="502" y2="158" stroke="#F4F7FC" stroke-width="3" />
      <!-- Roadway pedestrian crossing unlit -->
      <rect x="100" y="460" width="600" height="90" fill="#0C1320" />
      <line x1="120" y1="500" x2="200" y2="500" stroke="#192638" stroke-width="24" stroke-dasharray="30 20" />
      <line x1="300" y1="500" x2="380" y2="500" stroke="#192638" stroke-width="24" stroke-dasharray="30 20" />
      <line x1="480" y1="500" x2="560" y2="500" stroke="#192638" stroke-width="24" stroke-dasharray="30 20" />
      <!-- Warning Badge -->
      <rect x="40" y="40" width="220" height="44" rx="8" fill="#080D16" fill-opacity="0.9" stroke="#FFBF69" stroke-width="1.5" />
      <text x="60" y="68" fill="#FFBF69" font-family="monospace" font-size="14" font-weight="bold">ZERO LUX / UNLIT CROSSING</text>
    </svg>
  `),

  // Water Leak
  waterLeak: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#0C1320" />
      <!-- Concrete curb -->
      <rect x="0" y="240" width="800" height="60" fill="#121C2B" stroke="rgba(160,190,220,0.14)" stroke-width="2" />
      <!-- Pavement and gutter -->
      <rect x="0" y="300" width="800" height="300" fill="#080D16" />
      <!-- Pavement fracture point -->
      <ellipse cx="380" cy="380" rx="40" ry="20" fill="#0C1320" stroke="#42E8F5" stroke-width="2" />
      <!-- Water geyser / bubbling fountain -->
      <path d="M 370 380 Q 360 300 380 290 Q 400 300 390 380 Z" fill="#42E8F5" opacity="0.65" />
      <ellipse cx="380" cy="290" rx="20" ry="8" fill="#E0F9FE" />
      <!-- Flowing river along the curb -->
      <path d="M 0 320 Q 300 330 380 380 Q 500 420 800 460 L 800 520 L 0 520 Z" fill="#0284C7" opacity="0.35" />
      <path d="M 380 380 Q 550 430 800 490 L 800 510 L 380 410 Z" fill="#42E8F5" opacity="0.45" />
      <!-- Water pressure badge -->
      <rect x="40" y="40" width="240" height="44" rx="8" fill="#080D16" fill-opacity="0.9" stroke="#42E8F5" stroke-width="1.5" />
      <text x="60" y="68" fill="#42E8F5" font-family="monospace" font-size="14" font-weight="bold">MAIN SURGE / WATER WASTE</text>
    </svg>
  `),

  // Accessibility Barrier (Blocked ramp)
  accessibilityBarrier: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#0C1320" />
      <!-- Yellow tactile paving ramp -->
      <polygon points="260,180 540,180 620,480 180,480" fill="#CA8A04" opacity="0.75" />
      <!-- Tactile bump pattern -->
      <circle cx="360" cy="240" r="6" fill="#854D0E" />
      <circle cx="400" cy="240" r="6" fill="#854D0E" />
      <circle cx="440" cy="240" r="6" fill="#854D0E" />
      <circle cx="340" cy="300" r="7" fill="#854D0E" />
      <circle cx="390" cy="300" r="7" fill="#854D0E" />
      <circle cx="440" cy="300" r="7" fill="#854D0E" />
      <circle cx="490" cy="300" r="7" fill="#854D0E" />
      <!-- Heavy illegal concrete block / barrier blocking access -->
      <polygon points="280,340 500,340 530,420 250,420" fill="#121C2B" stroke="#FF6B78" stroke-width="3" />
      <polygon points="280,340 330,300 550,300 500,340" fill="#192638" stroke="#FF6B78" stroke-width="3" />
      <!-- Wheelchair impassable symbol -->
      <circle cx="390" cy="370" r="22" fill="#3B151C" stroke="#FF6B78" stroke-width="2" />
      <line x1="375" y1="355" x2="405" y2="385" stroke="#F4F7FC" stroke-width="3" />
      <!-- Badge -->
      <rect x="40" y="40" width="250" height="44" rx="8" fill="#080D16" fill-opacity="0.9" stroke="#FF6B78" stroke-width="1.5" />
      <text x="60" y="68" fill="#FF6B78" font-family="monospace" font-size="14" font-weight="bold">RAMP BLOCKED / ZERO ACCESS</text>
    </svg>
  `),

  // Public Spaces (Broken park bench & fixtures)
  publicSpaceBroken: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#080D16" />
      <!-- Grass and park path -->
      <rect x="0" y="380" width="800" height="220" fill="#064E3B" opacity="0.35" />
      <!-- Broken wooden slats on metal frame -->
      <path d="M 220 460 L 220 300 L 260 220" fill="none" stroke="#192638" stroke-width="10" />
      <path d="M 580 460 L 580 300 L 620 220" fill="none" stroke="#192638" stroke-width="10" />
      <!-- Fractured seat slat -->
      <polygon points="210,320 380,320 395,355 210,335" fill="#78350F" stroke="#92400E" stroke-width="2" />
      <polygon points="430,350 590,320 590,335 440,365" fill="#78350F" stroke="#92400E" stroke-width="2" />
      <!-- Dangling broken splinter -->
      <polygon points="380,320 430,350 410,380 375,340" fill="#B45309" stroke="#FF6B78" stroke-width="2" />
      <!-- Hazard warning -->
      <rect x="40" y="40" width="230" height="44" rx="8" fill="#080D16" fill-opacity="0.9" stroke="#FFBF69" stroke-width="1.5" />
      <text x="60" y="68" fill="#FFBF69" font-family="monospace" font-size="14" font-weight="bold">PARK ASSET / COLLAPSED</text>
    </svg>
  `),
};
