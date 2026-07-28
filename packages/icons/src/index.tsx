import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const defaultProps = (size = 24): IconProps => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

// Cricket bat icon
export const BatIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M4 20L8 16M8 16L18 6C19.1046 4.89543 20.8954 4.89543 22 6V6C23.1046 7.10457 23.1046 8.89543 22 10L12 20L8 16Z" />
    <path d="M2 22L4 20" />
  </svg>
);

// Cricket ball icon
export const BallIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M7.5 4.2C9 7.5 9 16.5 7.5 19.8" />
    <path d="M16.5 4.2C15 7.5 15 16.5 16.5 19.8" />
  </svg>
);

// Stumps / Wicket icon
export const WicketIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <line x1="8" y1="3" x2="8" y2="21" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="16" y1="3" x2="16" y2="21" />
    <line x1="6" y1="3" x2="18" y2="3" />
    <line x1="7" y1="5" x2="17" y2="5" />
  </svg>
);

// Trophy icon
export const TrophyIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

// Scoreboard icon
export const ScoreboardIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M6 7h2" />
    <path d="M16 7h2" />
    <path d="M6 17h2" />
    <path d="M16 17h2" />
  </svg>
);

// Overlay / Broadcast icon
export const OverlayIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Players icon
export const PlayersIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// Field / Pitch icon
export const FieldIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <ellipse cx="12" cy="12" rx="10" ry="8" />
    <rect x="10" y="6" width="4" height="12" rx="0.5" />
  </svg>
);

// Timer / Clock icon
export const TimerIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2 2" />
    <path d="M5 3L2 6" />
    <path d="M19 3l3 3" />
    <path d="M12 2v2" />
  </svg>
);

// Undo icon
export const UndoIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
  </svg>
);

// Redo icon
export const RedoIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M21 7v6h-6" />
    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
  </svg>
);

// Pause icon
export const PauseIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

// Play icon
export const PlayIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <polygon points="5,3 19,12 5,21" fill="currentColor" />
  </svg>
);

// Settings gear
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

// Four boundary icon
export const FourIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <text
      x="12"
      y="17"
      textAnchor="middle"
      fill="currentColor"
      stroke="none"
      fontSize="16"
      fontWeight="800"
      fontFamily="Oswald, sans-serif"
    >
      4
    </text>
  </svg>
);

// Six icon
export const SixIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <text
      x="12"
      y="17"
      textAnchor="middle"
      fill="currentColor"
      stroke="none"
      fontSize="16"
      fontWeight="800"
      fontFamily="Oswald, sans-serif"
    >
      6
    </text>
  </svg>
);

// Live dot indicator
export const LiveDotIcon: React.FC<IconProps> = ({ size = 8, ...props }) => (
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} {...props}>
    <circle cx={size / 2} cy={size / 2} r={size / 2} fill="var(--color-live)" />
  </svg>
);

// Toss coin icon
export const TossIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12" />
    <path d="M8 10h8" />
    <path d="M8 14h8" />
  </svg>
);
