'use client';

import { useState } from 'react';
import { Play,  Camera, X } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';

interface Props {
  universityId: string;
  virtualTourUrl?: string;
}

const PLACEHOLDER_GALLERY: GalleryItem[] = [
  { id: '1', universityId: '', type: 'photo', url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800', caption: 'Main Administration Block' },
  { id: '2', universityId: '', type: 'photo', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', caption: 'Campus Library' },
  { id: '3', universityId: '', type: 'photo', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', caption: 'Student Centre' },
  { id: '4', universityId: '', type: 'photo', url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800', caption: 'Lecture Halls' },
  { id: '5', universityId: '', type: 'photo', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', caption: 'Sports Grounds' },
  { id: '6', universityId: '', type: 'photo', url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800', caption: 'Innovation Lab' },
];

export default function GallerySection({ universityId, virtualTourUrl }: Props) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const gallery = PLACEHOLDER_GALLERY.map(g => ({ ...g, universityId }));

  return (
    <div className="card card-body">
      <h2 style={{
        fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', fontWeight: 600,
        color: 'var(--navy-deep)', marginBottom: 8, paddingBottom: 12,
        borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 8}}>
        <span style={{ color: 'var(--gold-primary)' }}><Camera size={18} /></span>
        Campus Gallery
      </h2>

      {virtualTourUrl && (
        <a
          href={virtualTourUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
            background: 'var(--navy-deep)', borderRadius: 'var(--radius-lg)', marginBottom: 20,
            textDecoration: 'none', color: 'white', transition: 'var(--transition)'}}
        >
          <div style={{
            width: 48, height: 48, borderRadius: '50%', background: 'var(--gold-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
            <Play size={20} fill="white" stroke="none" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Take a Virtual Campus Tour</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>360° immersive tour · Drone footage available</div>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--gold-primary)', fontSize: '1.2rem' }}>→</span>
        </a>
      )}

      {/* Photo Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {gallery.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            style={{
              border: 'none', padding: 0, cursor: 'pointer', borderRadius: 'var(--radius-md)',
              overflow: 'hidden', aspectRatio: i === 0 ? '2/1' : '1/1',
              gridColumn: i === 0 ? '1 / -1' : undefined,
              position: 'relative'}}
          >
            <img
              src={item.url}
              alt={item.caption}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
            {item.caption && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                color: 'white', fontSize: '0.72rem', textAlign: 'left'}}>
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
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20}}
          onClick={() => setSelected(null)}
        >
          <img
            src={selected.url}
            alt={selected.caption}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 'var(--radius-lg)' }}
          />
          {selected.caption && (
            <div style={{
              position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
              color: 'white', fontSize: '0.9rem', background: 'rgba(0,0,0,0.6)',
              padding: '8px 20px', borderRadius: 'var(--radius-full)'}}>
              {selected.caption}
            </div>
          )}
          <button
            onClick={() => setSelected(null)}
            style={{
              position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)',
              border: 'none', color: 'white', cursor: 'pointer', borderRadius: '50%',
              width: 40, height: 40, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          >
            <X size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
