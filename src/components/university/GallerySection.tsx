'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Camera, X } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';
import { universityGalleries } from '@/lib/data/universityGalleries';

interface Props {
  universityId: string;
  virtualTourUrl?: string;
  items?: GalleryItem[];
}

export default function GallerySection({ universityId, virtualTourUrl, items }: Props) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    if (selected) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected]);

  const gallery = items && items.length > 0 
    ? items 
    : universityGalleries[universityId] || [];

  return (
    <div className="card card-body" style={{ borderRadius: 'var(--radius-xl)' }}>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600,
        letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12, paddingBottom: 14,
        borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 10}}>
        <span style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center' }}><Camera size={20} /></span>
        Campus Gallery
      </h2>

      <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 22 }}>
        Authentic campus photography showcasing lecture facilities, architectural landmarks, and grounds.
      </p>

      {virtualTourUrl && (
        <a
          href={virtualTourUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px',
            background: 'var(--navy-deep)', borderRadius: 'var(--radius-lg)', marginBottom: 24,
            textDecoration: 'none', color: '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            transition: 'transform var(--apple-press), box-shadow var(--apple-ease)',
            boxShadow: 'var(--shadow-sm)'}}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 'var(--radius-full)', background: 'var(--gold-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(199, 155, 55, 0.35)'}}>
            <Play size={18} fill="white" stroke="none" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.98rem', letterSpacing: '-0.01em' }}>Take a Virtual Campus Tour</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.72)', marginTop: 2 }}>360° immersive tour · Aerial drone footage available</div>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--gold-primary)', fontSize: '1.2rem' }}>→</span>
        </a>
      )}

      {/* Photo Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {gallery.map((item, i) => (
          <button
            key={item.id || `${universityId}-${i}`}
            onClick={() => setSelected(item)}
            className="gallery-item-btn"
            style={{
              border: '1px solid var(--border-light)',
              borderTop: '1px solid var(--apple-glass-highlight)',
              padding: 0,
              cursor: 'pointer',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              aspectRatio: i === 0 ? '16/9' : '4/3',
              gridColumn: i === 0 && gallery.length > 2 ? '1 / -1' : undefined,
              position: 'relative',
              background: 'var(--bg-secondary)',
              textAlign: 'left',
              display: 'block',
              width: '100%',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform var(--apple-press), box-shadow var(--apple-ease)',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={item.url}
              alt={item.caption || 'University campus photo'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
            {item.caption && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 18px',
                background: 'linear-gradient(to top, rgba(11,17,32,0.92) 0%, rgba(11,17,32,0.5) 70%, transparent 100%)',
                color: '#FFFFFF', fontSize: '0.84rem', fontWeight: 500, lineHeight: 1.45,
                letterSpacing: '-0.01em'}}>
                {item.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Apple Lightbox with Critically Damped Spring Physics */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(11, 17, 32, 0.88)',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'relative',
                maxWidth: '92vw',
                maxHeight: '88vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selected.url}
                alt={selected.caption || 'Full view'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '76vh',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: '0 32px 72px -12px rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              />
              {selected.caption && (
                <div
                  style={{
                    marginTop: 18,
                    color: '#FFFFFF',
                    fontSize: '0.94rem',
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.45)',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-full)',
                    textAlign: 'center',
                    maxWidth: 620,
                    lineHeight: 1.5,
                    overflowWrap: 'anywhere',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {selected.caption}
                </div>
              )}
            </motion.div>

            {/* Apple Close Pill Button */}
            <button
              onClick={() => setSelected(null)}
              aria-label="Close image preview"
              style={{
                position: 'absolute',
                top: 28,
                right: 28,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderTop: '1px solid rgba(255, 255, 255, 0.5)',
                color: '#FFFFFF',
                cursor: 'pointer',
                borderRadius: 'var(--radius-full)',
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                transition: 'transform var(--apple-press), background var(--apple-ease)',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
