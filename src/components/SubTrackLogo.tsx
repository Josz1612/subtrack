import React from 'react';

interface SubTrackLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  textColor?: string;
  textClassName?: string;
  variant?: 'original' | 'adaptive' | 'monochrome';
}

/**
 * SubTrack Official Logo Component
 * Recreates the exact brand emblem: circular gear wheel with cyclical tracking arrows
 * and the interlocking "ST" (SubTrack) monogram in warm amber & terracotta tones.
 */
export const SubTrackLogo: React.FC<SubTrackLogoProps> = ({
  size = 40,
  className = '',
  showText = false,
  textColor = 'text-white',
  textClassName = '',
  variant = 'original',
}) => {
  // Brand Colors matching the official logo
  const gearColorTop = variant === 'monochrome' ? 'currentColor' : '#c85a3c'; // Rust/terracotta
  const gearColorBottom = variant === 'monochrome' ? 'currentColor' : '#d46234'; // Terracotta
  const letterTColor = variant === 'monochrome' ? 'currentColor' : '#d89b37'; // Golden amber
  const letterSColor = variant === 'monochrome' ? 'currentColor' : '#ca593e'; // Coral terracotta
  const innerBgColor = variant === 'monochrome' ? 'transparent' : '#faeedb'; // Warm cream/light beige disc

  const numericSize = typeof size === 'number' ? size : 40;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={numericSize}
        height={numericSize}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 select-none drop-shadow-sm"
        aria-label="SubTrack Logo"
      >
        <defs>
          <radialGradient id="stInnerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor={innerBgColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f3deb9" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="stGearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#de6a42" />
            <stop offset="50%" stopColor="#c55333" />
            <stop offset="100%" stopColor="#b44325" />
          </linearGradient>
          <linearGradient id="stAmberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5a943" />
            <stop offset="100%" stopColor="#c78627" />
          </linearGradient>
          <linearGradient id="stRustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d66141" />
            <stop offset="100%" stopColor="#ad3d20" />
          </linearGradient>
          {/* Subtle drop shadow filter for ST monogram depth */}
          <filter id="stShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* 1. Outer Circular Gear with Cycle Tracking Arrows */}
        <g id="gear-cycle-ring">
          {/* Top Half of Gear with Clockwise Arrow */}
          <path
            d="
              M 96 22 
              L 124 33 
              L 106 50 
              L 106 41
              C 133 42, 154 62, 158 89
              L 174 88
              L 174 100
              L 158 100
              C 156 112, 149 123, 140 131
              L 150 143
              L 140 152
              L 128 142
              C 122 147, 114 151, 105 153
              L 105 137
              C 112 135, 119 131, 125 125
              C 134 116, 140 102, 139 88
              C 136 67, 120 50, 96 48
              Z
            "
            fill="url(#stGearGrad)"
          />

          {/* Left / Top-Left Gear Cogs */}
          <path
            d="
              M 92 48
              C 68 50, 52 68, 49 89
              C 47 103, 53 117, 62 126
              L 73 117
              C 67 111, 64 103, 65 94
              C 67 79, 79 67, 94 65
              L 94 48
              Z
            "
            fill="url(#stGearGrad)"
          />

          {/* Bottom Half of Gear with Counter-Clockwise Arrow */}
          <path
            d="
              M 104 178
              L 76 167
              L 94 150
              L 94 159
              C 67 158, 46 138, 42 111
              L 26 112
              L 26 100
              L 42 100
              C 44 88, 51 77, 60 69
              L 50 57
              L 60 48
              L 72 58
              C 78 53, 86 49, 95 47
              L 95 63
              C 88 65, 81 69, 75 75
              C 66 84, 60 98, 61 112
              C 64 133, 80 150, 104 152
              Z
            "
            fill="url(#stRustGrad)"
          />

          {/* Outer Gear Teeth Accents for high fidelity match */}
          {/* Top-Right Tooth */}
          <path d="M 148 44 L 163 56 L 153 66 L 140 57 Z" fill="#cf5f3c" />
          {/* Right Tooth */}
          <path d="M 166 90 L 180 94 L 178 110 L 164 108 Z" fill="#be4f30" />
          {/* Bottom-Right Tooth */}
          <path d="M 142 144 L 150 160 L 136 168 L 128 153 Z" fill="#b94a2b" />
          {/* Bottom-Left Tooth */}
          <path d="M 52 156 L 37 144 L 47 134 L 60 143 Z" fill="#d46542" />
          {/* Left Tooth */}
          <path d="M 34 110 L 20 106 L 22 90 L 36 92 Z" fill="#dc6f49" />
          {/* Top-Left Tooth */}
          <path d="M 58 56 L 50 40 L 64 32 L 72 47 Z" fill="#e0754f" />
        </g>

        {/* 2. Inner Light Warm Beige Disc */}
        <circle cx="100" cy="100" r="46" fill="url(#stInnerGlow)" />

        {/* 3. The Interlocking "ST" Monogram */}
        <g id="st-monogram" filter="url(#stShadow)">
          {/* Letter "T" (Golden Amber) */}
          {/* Horizontal Top Bar */}
          <path
            d="
              M 72 73
              C 72 71.5, 73.5 70, 75 70
              L 125 70
              C 126.5 70, 128 71.5, 128 73
              L 128 85
              C 128 86.5, 126.5 88, 125 88
              L 109 88
              L 109 133
              C 109 134.5, 107.5 136, 106 136
              L 94 136
              C 92.5 136, 91 134.5, 91 133
              L 91 88
              L 75 88
              C 73.5 88, 72 86.5, 72 85
              Z
            "
            fill="url(#stAmberGrad)"
          />

          {/* Letter "S" (Warm Terracotta / Coral) - Interlocking with T */}
          <path
            d="
              M 124 82
              C 124 76, 114 74, 101 74
              C 84 74, 76 83, 76 93
              C 76 103, 86 108, 98 111
              C 111 114, 117 117, 117 124
              C 117 131, 109 135, 98 135
              C 83 135, 76 128, 75 120
              L 87 118
              C 88 123, 91 126, 98 126
              C 104 126, 107 123, 107 119
              C 107 113, 100 110, 89 107
              C 78 104, 66 99, 66 89
              C 66 76, 79 66, 99 66
              C 118 66, 126 76, 126 84
              Z
            "
            fill="url(#stRustGrad)"
            opacity="0.94"
          />

          {/* S and T Intersecting Overlap Accent (Blending effect from original logo) */}
          <path
            d="
              M 91 88
              L 109 88
              L 109 108
              C 105 107, 100 106, 96 105
              L 91 103
              Z
            "
            fill="#b85732"
            opacity="0.85"
          />
        </g>
      </svg>

      {showText && (
        <span
          className={`font-extrabold tracking-tight select-none ${textColor} ${textClassName}`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          SubTrack
        </span>
      )}
    </div>
  );
};

/**
 * Data URI SVG string of the SubTrack logo for standard <img> tags and meta tags
 */
export const SUBTRACK_LOGO_SVG_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="#faeedb"/>
      <stop offset="100%" stop-color="#f3deb9"/>
    </radialGradient>
    <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#de6a42"/>
      <stop offset="50%" stop-color="#c55333"/>
      <stop offset="100%" stop-color="#b44325"/>
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e5a943"/>
      <stop offset="100%" stop-color="#c78627"/>
    </linearGradient>
    <linearGradient id="rustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d66141"/>
      <stop offset="100%" stop-color="#ad3d20"/>
    </linearGradient>
  </defs>
  <!-- Gear & Cycle Arrows -->
  <path d="M 96 22 L 124 33 L 106 50 L 106 41 C 133 42, 154 62, 158 89 L 174 88 L 174 100 L 158 100 C 156 112, 149 123, 140 131 L 150 143 L 140 152 L 128 142 C 122 147, 114 151, 105 153 L 105 137 C 112 135, 119 131, 125 125 C 134 116, 140 102, 139 88 C 136 67, 120 50, 96 48 Z" fill="url(#gearGrad)"/>
  <path d="M 92 48 C 68 50, 52 68, 49 89 C 47 103, 53 117, 62 126 L 73 117 C 67 111, 64 103, 65 94 C 67 79, 79 67, 94 65 L 94 48 Z" fill="url(#gearGrad)"/>
  <path d="M 104 178 L 76 167 L 94 150 L 94 159 C 67 158, 46 138, 42 111 L 26 112 L 26 100 L 42 100 C 44 88, 51 77, 60 69 L 50 57 L 60 48 L 72 58 C 78 53, 86 49, 95 47 L 95 63 C 88 65, 81 69, 75 75 C 66 84, 60 98, 61 112 C 64 133, 80 150, 104 152 Z" fill="url(#rustGrad)"/>
  <!-- Teeth -->
  <path d="M 148 44 L 163 56 L 153 66 L 140 57 Z" fill="#cf5f3c"/>
  <path d="M 166 90 L 180 94 L 178 110 L 164 108 Z" fill="#be4f30"/>
  <path d="M 142 144 L 150 160 L 136 168 L 128 153 Z" fill="#b94a2b"/>
  <path d="M 52 156 L 37 144 L 47 134 L 60 143 Z" fill="#d46542"/>
  <path d="M 34 110 L 20 106 L 22 90 L 36 92 Z" fill="#dc6f49"/>
  <path d="M 58 56 L 50 40 L 64 32 L 72 47 Z" fill="#e0754f"/>
  <!-- Disc -->
  <circle cx="100" cy="100" r="46" fill="url(#bgGlow)"/>
  <!-- ST Monogram -->
  <path d="M 72 73 C 72 71.5, 73.5 70, 75 70 L 125 70 C 126.5 70, 128 71.5, 128 73 L 128 85 C 128 86.5, 126.5 88, 125 88 L 109 88 L 109 133 C 109 134.5, 107.5 136, 106 136 L 94 136 C 92.5 136, 91 134.5, 91 133 L 91 88 L 75 88 C 73.5 88, 72 86.5, 72 85 Z" fill="url(#amberGrad)"/>
  <path d="M 124 82 C 124 76, 114 74, 101 74 C 84 74, 76 83, 76 93 C 76 103, 86 108, 98 111 C 111 114, 117 117, 117 124 C 117 131, 109 135, 98 135 C 83 135, 76 128, 75 120 L 87 118 C 88 123, 91 126, 98 126 C 104 126, 107 123, 107 119 C 107 113, 100 110, 89 107 C 78 104, 66 99, 66 89 C 66 76, 79 66, 99 66 C 118 66, 126 76, 126 84 Z" fill="url(#rustGrad)" opacity="0.95"/>
  <path d="M 91 88 L 109 88 L 109 108 C 105 107, 100 106, 96 105 L 91 103 Z" fill="#b85732" opacity="0.85"/>
</svg>
`)}`;
