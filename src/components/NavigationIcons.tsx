import React from 'react';

interface IconProps {
  className?: string;
  isActive?: boolean;
}

export const HomeIcon: React.FC<IconProps> = ({ className = "w-6 h-6", isActive = false }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <defs>
      <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isActive ? "#EC4899" : "#6B7280"} />
        <stop offset="100%" stopColor={isActive ? "#9333EA" : "#9CA3AF"} />
      </linearGradient>
    </defs>
    {/* Solid house shape */}
    <path
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6m-6 0H6a1 1 0 01-1-1V10"
      stroke="url(#homeGradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Solid door */}
    <rect
      x="10"
      y="16"
      width="4"
      height="5"
      fill={isActive ? "#EC4899" : "#6B7280"}
      opacity={isActive ? "0.8" : "0.6"}
      rx="0.5"
    />
  </svg>
);

export const CheckInIcon: React.FC<IconProps> = ({ className = "w-6 h-6", isActive = false }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <defs>
      <linearGradient id="checkinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isActive ? "#EC4899" : "#6B7280"} />
        <stop offset="100%" stopColor={isActive ? "#9333EA" : "#9CA3AF"} />
      </linearGradient>
    </defs>
    {/* Solid heart shape */}
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill="url(#checkinGradient)"
      opacity={isActive ? "1" : "0.8"}
    />
    {/* Small checkmark inside */}
    <path
      d="M9 12l2 2 4-4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={isActive ? "1" : "0.9"}
    />
  </svg>
);

export const CalmlyIcon: React.FC<IconProps> = ({ className = "w-6 h-6", isActive = false }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <defs>
      <linearGradient id="calmlyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isActive ? "#06B6D4" : "#6B7280"} />
        <stop offset="100%" stopColor={isActive ? "#0891B2" : "#9CA3AF"} />
      </linearGradient>
    </defs>
    {/* Zen circle (enso) */}
    <circle
      cx="12"
      cy="12"
      r="8"
      stroke="url(#calmlyGradient)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeDasharray="45 5"
      opacity={isActive ? "1" : "0.8"}
      transform="rotate(-90 12 12)"
    />
    {/* Inner peaceful dots */}
    <circle 
      cx="12" 
      cy="8" 
      r="1.5" 
      fill="url(#calmlyGradient)" 
      opacity={isActive ? "0.9" : "0.6"} 
    />
    <circle 
      cx="12" 
      cy="12" 
      r="1" 
      fill="url(#calmlyGradient)" 
      opacity={isActive ? "0.7" : "0.4"} 
    />
    <circle 
      cx="12" 
      cy="16" 
      r="1.5" 
      fill="url(#calmlyGradient)" 
      opacity={isActive ? "0.9" : "0.6"} 
    />
  </svg>
);

export const MeditateIcon: React.FC<IconProps> = ({ className = "w-6 h-6", isActive = false }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <defs>
      <linearGradient id="meditateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isActive ? "#EC4899" : "#6B7280"} />
        <stop offset="100%" stopColor={isActive ? "#9333EA" : "#9CA3AF"} />
      </linearGradient>
    </defs>
    {/* Solid meditation figure */}
    <circle
      cx="12"
      cy="8"
      r="3"
      fill="url(#meditateGradient)"
      opacity={isActive ? "1" : "0.8"}
    />
    {/* Body in meditation pose */}
    <path
      d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
      stroke="url(#meditateGradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={isActive ? "1" : "0.8"}
    />
    {/* Meditation aura dots */}
    <circle cx="8" cy="6" r="1" fill="url(#meditateGradient)" opacity={isActive ? "0.8" : "0.5"} />
    <circle cx="16" cy="6" r="1" fill="url(#meditateGradient)" opacity={isActive ? "0.6" : "0.3"} />
    <circle cx="12" cy="4" r="0.8" fill="url(#meditateGradient)" opacity={isActive ? "0.7" : "0.4"} />
  </svg>
);

export const ReflectIcon: React.FC<IconProps> = ({ className = "w-6 h-6", isActive = false }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <defs>
      <linearGradient id="reflectGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isActive ? "#F59E0B" : "#6B7280"} />
        <stop offset="100%" stopColor={isActive ? "#D97706" : "#9CA3AF"} />
      </linearGradient>
    </defs>
    {/* Solid calendar/journal shape */}
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      fill="url(#reflectGradient)"
      opacity={isActive ? "1" : "0.8"}
    />
    {/* Calendar header */}
    <rect
      x="3"
      y="4"
      width="18"
      height="4"
      fill="url(#reflectGradient)"
      opacity={isActive ? "1" : "0.9"}
      rx="2"
    />
    {/* Calendar lines */}
    <line x1="7" y1="12" x2="17" y2="12" stroke="white" strokeWidth="1.5" opacity="0.9" />
    <line x1="7" y1="15" x2="15" y2="15" stroke="white" strokeWidth="1.5" opacity="0.7" />
    <line x1="7" y1="18" x2="13" y2="18" stroke="white" strokeWidth="1.5" opacity="0.5" />
    {/* Calendar rings */}
    <circle cx="8" cy="2" r="1" fill="url(#reflectGradient)" opacity={isActive ? "0.8" : "0.6"} />
    <circle cx="16" cy="2" r="1" fill="url(#reflectGradient)" opacity={isActive ? "0.8" : "0.6"} />
  </svg>
);