import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export type EmptyVariant = 'analytics' | 'inbox' | 'docs' | 'quotes' | 'gallery' | 'search';

/**
 * Hand drawn style SVG illustrations for empty states, themed for a health
 * data portfolio. Cohesive language: slate line work, electric blue hero
 * shapes, teal pulse accents, soft orbit ring, gentle looping motion.
 * Admin surfaces are always dark, so colors target dark backgrounds.
 */

const STROKE = '#64748b';
const ELECTRIC = '#2A6BFF';
const TEAL = '#00A6A6';

const Orbit: React.FC = () => (
  <ellipse
    cx="100"
    cy="75"
    rx="86"
    ry="58"
    fill="none"
    stroke={STROKE}
    strokeOpacity="0.25"
    strokeWidth="1.5"
    strokeDasharray="5 7"
    strokeLinecap="round"
  />
);

const FloatDot: React.FC<{ x: number; y: number; color?: string; delay?: number }> = ({
  x,
  y,
  color = ELECTRIC,
  delay = 0,
}) => (
  <motion.circle
    cx={x}
    cy={y}
    r="3.5"
    fill={color}
    initial={{ y: 0, opacity: 0.65 }}
    animate={{ y: [0, -6, 0], opacity: [0.65, 1, 0.65] }}
    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

const PulseLine: React.FC<{ points: string; color?: string; width?: number }> = ({
  points,
  color = TEAL,
  width = 120,
}) => (
  <motion.polyline
    points={points}
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
    style={{ maxWidth: width }}
  />
);

const AnalyticsArt: React.FC = () => (
  <g>
    <Orbit />
    <rect x="52" y="88" width="18" height="34" rx="4" fill="none" stroke={STROKE} strokeWidth="2.5" />
    <rect x="78" y="70" width="18" height="52" rx="4" fill="none" stroke={STROKE} strokeWidth="2.5" />
    <motion.rect
      x="104"
      y="48"
      width="18"
      height="74"
      rx="4"
      fill={`${ELECTRIC}22`}
      stroke={ELECTRIC}
      strokeWidth="2.5"
      initial={{ scaleY: 0.6, opacity: 0.6 }}
      animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.6, 1, 0.6] }}
      style={{ transformOrigin: '113px 122px' }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.g
      initial={{ rotate: -6 }}
      animate={{ rotate: [-6, 4, -6] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '146px 44px' }}
    >
      <circle cx="146" cy="44" r="17" fill="none" stroke={ELECTRIC} strokeWidth="2.5" />
      <line x1="158" y1="56" x2="170" y2="68" stroke={ELECTRIC} strokeWidth="3.5" strokeLinecap="round" />
    </motion.g>
    <PulseLine points="40,132 62,132 70,118 78,132 96,132 104,124 112,132 150,132" />
    <FloatDot x={36} y={52} delay={0.6} />
  </g>
);

const InboxArt: React.FC = () => (
  <g>
    <Orbit />
    <motion.g
      initial={{ y: 0 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <rect x="58" y="58" width="84" height="58" rx="8" fill="none" stroke={STROKE} strokeWidth="2.5" />
      <polyline
        points="58,66 100,96 142,66"
        fill="none"
        stroke={STROKE}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="96" r="11" fill="#141414" stroke={ELECTRIC} strokeWidth="2.5" />
      <polyline
        points="94,96 98,100 106,92"
        fill="none"
        stroke={ELECTRIC}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.g>
    <FloatDot x={52} y={40} color={TEAL} />
    <FloatDot x={150} y={48} delay={1.1} />
    <FloatDot x={162} y={100} color={TEAL} delay={1.8} />
  </g>
);

const DocsArt: React.FC = () => (
  <g>
    <Orbit />
    <motion.g
      initial={{ y: 0 }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path
        d="M70 34 h44 l16 16 v66 a6 6 0 0 1 -6 6 H70 a6 6 0 0 1 -6 -6 V40 a6 6 0 0 1 6 -6 z"
        fill="none"
        stroke={STROKE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M114 34 v16 h16" fill="none" stroke={STROKE} strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="76" y1="66" x2="118" y2="66" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="76" y1="78" x2="118" y2="78" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="76" y1="90" x2="100" y2="90" stroke={ELECTRIC} strokeWidth="2.5" strokeLinecap="round" />
    </motion.g>
    <motion.g
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, -8, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '146px 108px' }}
    >
      <line x1="132" y1="122" x2="158" y2="96" stroke={TEAL} strokeWidth="4" strokeLinecap="round" />
      <circle cx="160" cy="94" r="3" fill={TEAL} />
    </motion.g>
    <PulseLine points="64,134 86,134 92,126 98,134 130,134" />
  </g>
);

const QuotesArt: React.FC = () => (
  <g>
    <Orbit />
    <motion.g
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '100px 80px' }}
    >
      <path
        d="M100 36 c-26 0 -44 16 -44 38 c0 24 20 40 42 40 c6 0 12 -1 17 -4 l10 8 l-3 -14 c8 -7 12 -16 12 -26 c0 -24 -14 -42 -34 -42 z"
        fill="none"
        stroke={STROKE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text x="78" y="92" fontSize="42" fontWeight="bold" fill={ELECTRIC} fontFamily="Georgia, serif">
        ”
      </text>
    </motion.g>
    <motion.g
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <circle cx="52" cy="46" r="2.5" fill="#f59e0b" />
      <circle cx="150" cy="52" r="2.5" fill="#f59e0b" />
      <circle cx="160" cy="104" r="2.5" fill="#f59e0b" />
    </motion.g>
    <FloatDot x={42} y={100} color={TEAL} delay={0.9} />
  </g>
);

const GalleryArt: React.FC = () => (
  <g>
    <Orbit />
    <motion.g
      initial={{ y: 0 }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <rect x="56" y="44" width="88" height="66" rx="8" fill="none" stroke={STROKE} strokeWidth="2.5" />
      <circle cx="78" cy="64" r="7" fill="none" stroke={TEAL} strokeWidth="2.5" />
      <circle cx="78" cy="64" r="11" fill="none" stroke={TEAL} strokeOpacity="0.3" strokeWidth="1.5" />
      <path
        d="M56 102 l26 -24 l18 14 l16 -12 l28 22"
        fill="none"
        stroke={STROKE}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="132" y="52" width="18" height="18" rx="4" fill={`${ELECTRIC}22`} stroke={ELECTRIC} strokeWidth="2" />
      <line x1="137" y1="61" x2="145" y2="61" stroke={ELECTRIC} strokeWidth="2" strokeLinecap="round" />
      <line x1="141" y1="57" x2="141" y2="65" stroke={ELECTRIC} strokeWidth="2" strokeLinecap="round" />
    </motion.g>
    <FloatDot x={44} y={60} delay={0.4} />
    <FloatDot x={162} y={92} color={TEAL} delay={1.4} />
  </g>
);

const SearchArt: React.FC = () => (
  <g>
    <Orbit />
    <line x1="46" y1="52" x2="92" y2="52" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="46" y1="66" x2="80" y2="66" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="46" y1="80" x2="86" y2="80" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.35" />
    <motion.g
      initial={{ x: 0, y: 0 }}
      animate={{ x: [0, 8, 0], y: [0, -6, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '140px 96px' }}
    >
      <circle cx="140" cy="96" r="20" fill="none" stroke={ELECTRIC} strokeWidth="2.5" />
      <line x1="154" y1="110" x2="168" y2="124" stroke={ELECTRIC} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="132" y1="96" x2="148" y2="96" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" />
    </motion.g>
    <FloatDot x={52} y={108} color={TEAL} delay={0.7} />
  </g>
);

const ART: Record<EmptyVariant, React.FC> = {
  analytics: AnalyticsArt,
  inbox: InboxArt,
  docs: DocsArt,
  quotes: QuotesArt,
  gallery: GalleryArt,
  search: SearchArt,
};

export const EmptyIllustration: React.FC<{ variant: EmptyVariant; className?: string }> = ({
  variant,
  className,
}) => {
  const Art = ART[variant];
  return (
    <svg
      viewBox="0 0 200 150"
      role="img"
      aria-hidden="true"
      className={className ?? 'h-36 w-auto'}
    >
      <Art />
    </svg>
  );
};

interface AdminEmptyStateProps {
  variant: EmptyVariant;
  title: string;
  description: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

/** Standard illustrated empty state for admin managers (dark surfaces). */
export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  variant,
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-charcoal-light px-6 py-10 text-center">
    <EmptyIllustration variant={variant} />
    <p className="text-lg font-medium text-white">{title}</p>
    <div className="max-w-sm text-sm leading-relaxed text-white/50">{description}</div>
    {actionLabel && onAction && (
      <Button onClick={onAction} className="mt-2 bg-electric hover:bg-electric-dark text-white">
        {actionLabel}
      </Button>
    )}
  </div>
);
