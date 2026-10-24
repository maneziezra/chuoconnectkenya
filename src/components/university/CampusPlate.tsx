import React from 'react';

interface CampusPlateProps {
  name: string;
  abbrev: string;
  county: string;
  type: 'Public' | 'Private' | 'Technical' | 'TVET' | string;
  established?: number;
  image?: string;
  height?: number | string;
  variant?: 'card' | 'hero' | 'compact';
}

const PALETTE_BY_TYPE: Record<string, { bg: string; panel: string; accent: string; text: string; muted: string }> = {
  Public: {
    bg: '#161B26',
    panel: '#1F2636',
    accent: '#C79B37',
    text: '#F4F5F7',
    muted: 'rgba(244, 245, 247, 0.68)',
  },
  Private: {
    bg: '#1C1917',
    panel: '#26221E',
    accent: '#D49A3A',
    text: '#F4F5F7',
    muted: 'rgba(244, 245, 247, 0.68)',
  },
  Technical: {
    bg: '#142224',
    panel: '#1C2F32',
    accent: '#E0A83B',
    text: '#F4F5F7',
    muted: 'rgba(244, 245, 247, 0.68)',
  },
  TVET: {
    bg: '#211C17',
    panel: '#2C251E',
    accent: '#D9822B',
    text: '#F4F5F7',
    muted: 'rgba(244, 245, 247, 0.68)',
  },
};

function getCleanMonogram(name: string, abbrev: string): string {
  const trimmed = (abbrev || '').trim();
  if (trimmed.length >= 2 && trimmed.length <= 5 && !trimmed.includes(' ')) {
    return trimmed;
  }
  const stopWords = new Set(['of', 'and', 'the', 'for', 'in', 'at', 'to', '&']);
  const words = name
    .replace(/[^a-zA-Z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0 && !stopWords.has(w.toLowerCase()));
  if (words.length >= 2) {
    return words
      .slice(0, 4)
      .map(w => w[0].toUpperCase())
      .join('');
  }
  return trimmed.slice(0, 5).toUpperCase();
}

export default function CampusPlate({
  name,
  abbrev,
  county,
  type,
  established,
  image,
  height = 200,
  variant = 'card',
}: CampusPlateProps) {
  const hasRealPhoto = Boolean(image && image.trim().length > 0);
  const scheme = PALETTE_BY_TYPE[type] || PALETTE_BY_TYPE.Public;

  if (hasRealPhoto) {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height,
          overflow: 'hidden',
          background: scheme.bg,
        }}
      >
        <img
          src={image}
          alt={`${name} campus`}
          loading={variant === 'hero' ? 'eager' : 'lazy'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: variant === 'hero' ? 'rgba(18, 20, 23, 0.68)' : 'rgba(18, 20, 23, 0.22)',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  const isHero = variant === 'hero';
  const isCompact = variant === 'compact';
  const monogram = getCleanMonogram(name, abbrev);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        background: scheme.bg,
        color: scheme.text,
        display: 'grid',
        gridTemplateColumns: '42% 58%',
        userSelect: 'none',
      }}
      aria-label={`${name} architectural campus plate`}
    >
      {/* Left 42% Tonal Column */}
      <div
        style={{
          background: scheme.panel,
          padding: isCompact ? '14px 16px' : isHero ? '36px 40px' : '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: scheme.accent,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: scheme.accent,
              flexShrink: 0,
            }}
          />
          {type}
        </div>

        <div>
          <div
            className="tabular-nums"
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: scheme.muted,
              marginBottom: 2,
            }}
          >
            {established ? `Est. ${established}` : 'CUE Charter'}
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: scheme.text,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {county}
          </div>
        </div>
      </div>

      {/* Right 58% Monumental Monogram Axis */}
      <div
        style={{
          padding: isCompact ? '14px 16px' : isHero ? '36px 40px' : '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: scheme.muted,
            textAlign: 'right',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          CUE · TVETA
        </div>

        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: isHero
              ? 'clamp(3.25rem, 6.5vw, 5.5rem)'
              : isCompact
              ? '1.65rem'
              : '2.15rem',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            lineHeight: 0.92,
            color: scheme.text,
            whiteSpace: 'nowrap',
          }}
        >
          {monogram}
        </div>
      </div>
    </div>
  );
}
