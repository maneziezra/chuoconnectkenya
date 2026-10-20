'use client';

import { useState, useEffect } from 'react';
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
    <div className="card card-body">
      <h2 style={{
        fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 600,
        color: 'var(--text-primary)', marginBottom: 12, paddingBottom: 12,
        borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 10}}>
        <span style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center' }}><Camera size={20} /></span>
        Campus Gallery
      </h2>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
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
            textDecoration: 'none', color: '#FFFFFF', transition: 'var(--transition)',
            boxShadow: 'var(--shadow-sm)'}}
        >
          <div style={{
            width: 48, height: 48, borderRadius: '50%', background: 'var(--gold-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
            <Play size={20} fill="white" stroke="none" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.98rem' }}>Take a Virtual Campus Tour</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>360° immersive tour · Aerial drone footage available</div>
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
              border: '1px solid var(--border-light)', padding: 0, cursor: 'pointer',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              aspectRatio: i === 0 ? '16/9' : '4/3',
              gridColumn: i === 0 && gallery.length > 2 ? '1 / -1' : undefined,
              position: 'relative', background: 'var(--bg-secondary)',
              textAlign: 'left', display: 'block', width: '100%',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <img
              src={item.url}
              alt={item.caption || 'University campus photo'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
            {item.caption && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px',
                background: 'linear-gradient(to top, rgba(11,17,32,0.88) 0%, rgba(11,17,32,0.45) 70%, transparent 100%)',
                color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 500, lineHeight: 1.4}}>
                {item.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(11,17,32,0.94)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24}}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selected.url}
              alt={selected.caption || 'Full view'}
              style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
            />
            {selected.caption && (
              <div style={{
                marginTop: 16, color: '#FFFFFF', fontSize: '0.92rem', background: 'rgba(255,255,255,0.14)',
                backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)',
                padding: '10px 20px', borderRadius: 'var(--radius-lg)', textAlign: 'center', maxWidth: 600,
                lineHeight: 1.5, overflowWrap: 'anywhere'}}>
                {selected.caption}
              </div>
            )}
          </div>
          <button
            onClick={() => setSelected(null)}
            aria-label="Close image preview"
            style={{
              position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)', color: '#FFFFFF', cursor: 'pointer', borderRadius: '50%',
              width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'var(--transition)'}}
          >
            <X size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
