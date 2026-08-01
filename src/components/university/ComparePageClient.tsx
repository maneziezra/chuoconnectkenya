'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Scale, Star, MapPin, CheckCircle, X, Plus, ArrowRight } from 'lucide-react';
import type { University } from '@/lib/types';

const COMPARE_ROWS = [
  { label: 'Type', key: 'type' },
  { label: 'County', key: 'county' },
  { label: 'Established', key: 'established' },
  { label: 'Students', key: 'students' },
  { label: 'Tuition Fees', key: 'fees' },
  { label: 'Accommodation', key: 'accommodation' },
  { label: 'National Ranking', key: 'ranking', format: (v: unknown) => `#${v} in Kenya` },
  { label: 'Rating', key: 'rating', format: (v: unknown) => v ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{(v as number).toFixed(1)} <Star size={12} fill="var(--gold-primary)" color="var(--gold-primary)" /></span> : 'N/A' },
];

const STORAGE_KEY = 'cck_compare_list';

interface Props {
  initialUniversities: University[];
}

export default function ComparePageClient({ initialUniversities }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [universities, setUniversities] = useState<University[]>(initialUniversities);
  const [addQuery, setAddQuery] = useState('');
  const [searchResults, setSearchResults] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(initialUniversities.length === 0 && searchParams.get('ids') === null);

  // Sync from localStorage if no initial universities but localStorage has data
  useEffect(() => {
    if (initialUniversities.length === 0 && !searchParams.get('ids')) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as { id: string }[];
          if (parsed.length > 0) {
            const ids = parsed.map(p => p.id).join(',');
            // Fetch the universities and update URL
            fetch(`/api/universities?ids=${ids}`)
              .then(res => res.json())
              .then(data => {
                setUniversities(data);
                // Sync URL quietly
                router.replace(`/compare?ids=${ids}`);
                setIsLoading(false);
              });
            return;
          }
        }
      } catch (e) {
        console.error('Failed to parse compare list', e);
      }
      setIsLoading(false);
    }
  }, [initialUniversities.length, searchParams, router]);

  // Sync state changes back to URL and localStorage
  const updateStateAndUrl = (newUnis: University[]) => {
    setUniversities(newUnis);
    const ids = newUnis.map(u => u.id).join(',');
    
    // Update local storage so CompareButton reflects it globally
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUnis.map(u => ({ id: u.id, name: u.name, abbrev: u.abbrev }))));
    
    // Update URL
    if (ids) {
      router.replace(`/compare?ids=${ids}`, { scroll: false });
    } else {
      router.replace(`/compare`, { scroll: false });
    }
  };

  useEffect(() => {
    if (!addQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(addQuery)}`);
      if (res.ok) {
        const raw = await res.json();
        const uniIds = raw.filter((r: { type: string }) => r.type === 'university').map((r: { id: string }) => r.id);
        if (uniIds.length) {
          const res2 = await fetch(`/api/universities?ids=${uniIds.join(',')}`);
          if (res2.ok) setSearchResults(await res2.json());
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [addQuery]);

  const addUniversity = (uni: University) => {
    if (universities.length >= 3 || universities.find(u => u.id === uni.id)) return;
    updateStateAndUrl([...universities, uni]);
    setAddQuery('');
    setSearchResults([]);
  };

  const removeUniversity = (id: string) => {
    updateStateAndUrl(universities.filter(u => u.id !== id));
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-tertiary)' }}>
        Loading comparison...
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <Scale size={64} style={{ color: 'var(--text-tertiary)', margin: '0 auto 20px', display: 'block' }} />
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--navy-deep)', marginBottom: 12 }}>No campuses selected yet</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Go to any campus profile and click "Compare" to add them here.</p>
        <Link href="/universities" className="btn btn-navy">Browse Universities</Link>
      </div>
    );
  }

  return (
    <div>
      {/* University Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(${universities.length}, 1fr) ${universities.length < 3 ? '1fr' : ''}`, gap: 16, marginBottom: 32 }}>
        <div /> {/* Empty corner */}
        {universities.map(uni => (
          <div key={uni.id} style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <img src={uni.image} alt={uni.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className={`badge ${uni.type === 'Public' ? 'badge-navy' : 'badge-gold'}`} style={{ fontSize: '0.7rem' }}>{uni.type}</span>
                <button onClick={() => removeUniversity(uni.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 4 }}>
                  <X size={14} />
                </button>
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.95rem', fontWeight: 600, color: 'var(--navy-deep)', marginTop: 8, marginBottom: 4, lineHeight: 1.3 }}>{uni.name}</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={10} /> {uni.county}
              </div>
              <Link href={`/universities/${uni.id}`} className="btn btn-outline btn-sm" style={{ marginTop: 12, width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}>
                View Profile <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        ))}

        {/* Add More */}
        {universities.length < 3 && (
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', border: '2px dashed var(--border-medium)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight: 280 }}>
            <Plus size={32} style={{ color: 'var(--text-tertiary)', marginBottom: 12 }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 16, textAlign: 'center' }}>Add another campus</p>
            <input
              value={addQuery}
              onChange={e => setAddQuery(e.target.value)}
              placeholder="Search university…"
              style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-light)', fontSize: '0.8rem', outline: 'none' }}
            />
            {searchResults.length > 0 && (
              <div style={{ width: '100%', marginTop: 8, background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                {searchResults.filter(r => !universities.find(u => u.id === r.id)).slice(0, 4).map(r => (
                  <button key={r.id} onClick={() => addUniversity(r)} style={{ width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                    {r.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {COMPARE_ROWS.map((row, i) => (
          <div key={row.key} style={{
            display: 'grid',
            gridTemplateColumns: `180px repeat(${universities.length}, 1fr)`,
            gap: 0,
            background: i % 2 === 0 ? 'white' : 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-light)',
          }}>
            <div style={{ padding: '14px 20px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'flex', alignItems: 'center' }}>
              {row.label}
            </div>
            {universities.map(uni => {
              const val = uni[row.key as keyof University];
              const display = row.format ? row.format(val) : String(val ?? 'N/A');
              return (
                <div key={uni.id} style={{ padding: '14px 20px', fontSize: '0.875rem', color: 'var(--text-primary)', borderLeft: '1px solid var(--border-light)', display: 'flex', alignItems: 'center' }}>
                  {display}
                </div>
              );
            })}
          </div>
        ))}

        {/* Facilities Row */}
        <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(${universities.length}, 1fr)`, gap: 0, borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ padding: '14px 20px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'flex', alignItems: 'center' }}>Facilities</div>
          {universities.map(uni => (
            <div key={uni.id} style={{ padding: '14px 20px', borderLeft: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(uni.facilities ?? []).slice(0, 5).map(f => (
                  <span key={f} style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'var(--navy-light)', color: 'var(--navy-deep)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle size={10} style={{ color: 'var(--gold-primary)' }} /> {f}
                  </span>
                ))}
                {(uni.facilities ?? []).length > 5 && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>+{(uni.facilities ?? []).length - 5} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
