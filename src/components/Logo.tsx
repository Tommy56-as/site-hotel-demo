import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'white';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  showSubtitle = true,
}) => {
  const isWhite = variant === 'white';
  const primaryColor = isWhite ? '#FFFFFF' : '#163024';
  const accentColor = isWhite ? '#D4AF37' : '#C5A059';
  const terracottaColor = isWhite ? '#F3EFE6' : '#8C4A32';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* Luxury African Architectural Crest Emblem */}
      <div className="relative shrink-0 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-2xs transition-transform duration-300 hover:scale-105"
        >
          {/* Outer Octagonal Luxury Shield */}
          <polygon
            points="50,4 88,20 96,62 68,96 32,96 4,62 12,20"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
            fill={isWhite ? 'rgba(255,255,255,0.06)' : '#FAF8F5'}
          />

          {/* Inner Geometric Border */}
          <polygon
            points="50,11 81,24 88,59 64,88 36,88 12,59 19,24"
            stroke={primaryColor}
            strokeWidth="1.2"
            strokeOpacity="0.4"
            strokeDasharray="2 3"
            fill="none"
          />

          {/* Crown Arch / Palm Canopy Apex */}
          <path
            d="M50 16 L53 23 L60 22 L55 27 L57 34 L50 30 L43 34 L45 27 L40 22 L47 23 Z"
            fill={accentColor}
          />

          {/* Architectural Stylized 'M' Monogram */}
          <path
            d="M26 76 V40 L50 62 L74 40 V76 M26 76 H32 M74 76 H68"
            stroke={primaryColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner Diamond / Center Jewel */}
          <polygon
            points="50,44 55,51 50,58 45,51"
            fill={terracottaColor}
          />

          {/* Fine Base Ingot */}
          <line
            x1="34"
            y1="82"
            x2="66"
            y2="82"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typographic Wordmark 
      <div className="flex flex-col min-w-0">
        <span
          className="font-serif text-lg sm:text-2xl font-bold tracking-tight leading-tight truncate"
          style={{ color: primaryColor }}
        >
          Mboa <span className="font-normal italic">Collection</span>
        </span>
        {showSubtitle && (
          <span
            className="text-[9px] sm:text-[10px] uppercase tracking-[0.24em] font-semibold truncate leading-none mt-0.5"
            style={{ color: terracottaColor }}
          >
            Cameroun · Sanctuaires d’Exception
          </span>
        )}
      </div>*/}
    </div>
  );
};
