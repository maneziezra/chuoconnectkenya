'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Scale, Star, MapPin, CheckCircle, X, Plus, ArrowRight, Building2, Search } from 'lucide-react';
import type { University } from '@/lib/types';

const COMPARE_ROWS = [
  { label: 'Institution Type', key: 'type' },
  { label: 'County & Location', key: 'county' },
  { label: 'Year Established', key: 'established' },
  { label: 'Student Population', key: 'students' },
  { label: 'Tuition Fees (Annual)', key: 'fees' },
  { label: 'Hostel Accommodation', key: 'accommodation' },
  { label: 'National Ranking', key: 'ranking', format: (v: unknown) => v ? `#${v} in Kenya` : '—' },
  {
    label: 'Student Rating',
    key: 'rating',
    format: (v: unknown) => v ? (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
        {(v as number).toFixed(1)} <Star size={13} fill="var(--accent-gold)" color="var(--accent-gold)" />
      </span>
    ) : 'N/A'
  },
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
            fetch(`/api/universities?ids=${ids}`)
              .then(res => res.json())
              .then(data => {
                setUniversities(data);
                router.replace(`/compare?ids=${ids}`);
                setIsLoading(false);
              })
              .catch(() => setIsLoading(false));
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
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUnis.map(u => ({ id: u.id, name: u.name, abbrev: u.abbrev }))));
    
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
    }, 280);
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
      <div style={{ textAlign: 'center', padding: '96px 20px', color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>
        Loading comparison...
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px 24px',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          maxWidth: 620,
          margin: '0 auto',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 10px 30px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--gold-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'var(--accent-gold)',
          }}
        >
          <Scale size={36} />
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            marginBottom: 10,
          }}
        >
          No Campuses Selected
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: 28 }}>
          Browse any university profile and click &ldquo;Compare&rdquo; to evaluate tuition, programmes, and facilities side-by-side.
        </p>
        <Link
          href="/universities"
          className="btn btn-gold"
          style={{ borderRadius: 'var(--radius-full)', padding: '10px 24px', fontWeight: 600 }}
        >
          Browse Universities
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* University Top Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `200px repeat(${universities.length}, 1fr) ${universities.length < 3 ? '1fr' : ''}`,
          gap: 18,
          marginBottom: 24,
          alignItems: 'stretch',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 16 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Selected Institutions ({universities.length}/3)
          </div>
        </div>

        {universities.map(uni => (
          <div
            key={uni.id}
            style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ position: 'relative', height: 140, width: '100%', background: 'var(--bg-secondary)' }}>
              <img
                src={uni.image}
                alt={uni.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => removeUniversity(uni.id)}
                aria-label={`Remove ${uni.name} from comparison`}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.55)',
                  backdropFilter: 'blur(8px)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s ease',
                }}
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: uni.type === 'Public' ? 'var(--gold-glow)' : 'var(--bg-secondary)',
                    color: uni.type === 'Public' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  {uni.type}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={11} /> {uni.county}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginTop: 8,
                  marginBottom: 14,
                  lineHeight: 1.3,
                  flex: 1,
                }}
              >
                {uni.name}
              </h3>

              <Link
                href={`/universities/${uni.id}`}
                className="btn btn-outline btn-sm"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                }}
              >
                View Profile <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        ))}

        {/* Add More Campus Slot */}
        {universities.length < 3 && (
          <div
            style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-xl)',
              border: '2px dashed var(--border-medium)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 20px',
              minHeight: 260,
              position: 'relative',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                color: 'var(--accent-gold)',
              }}
            >
              <Plus size={22} />
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, textAlign: 'center' }}>
              Add Another Campus
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 14, textAlign: 'center' }}>
              Compare up to 3 Kenyan universities
            </p>

            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                value={addQuery}
                onChange={e => setAddQuery(e.target.value)}
                placeholder="Search university..."
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />

              {searchResults.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 6,
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    overflow: 'hidden',
                    zIndex: 20,
                  }}
                >
                  {searchResults.filter(r => !universities.find(u => u.id === r.id)).slice(0, 4).map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => addUniversity(r)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 14px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        borderBottom: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Building2 size={13} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Specifications Table */}
      <div
        style={{
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03)',
        }}
      >
        {COMPARE_ROWS.map((row, i) => (
          <div
            key={row.key}
            style={{
              display: 'grid',
              gridTemplateColumns: `200px repeat(${universities.length}, 1fr)`,
              gap: 0,
              background: i % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-light)',
            }}
          >
            <div
              style={{
                padding: '16px 22px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {row.label}
            </div>
            {universities.map(uni => {
              const val = uni[row.key as keyof University];
              const display = row.format ? row.format(val) : String(val ?? 'N/A');
              return (
                <div
                  key={uni.id}
                  style={{
                    padding: '16px 22px',
                    fontSize: '0.88rem',
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    borderLeft: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {display}
                </div>
              );
            })}
          </div>
        ))}

        {/* Facilities Specification Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `200px repeat(${universities.length}, 1fr)`,
            gap: 0,
            background: COMPARE_ROWS.length % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)',
          }}
        >
          <div
            style={{
              padding: '16px 22px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Campus Facilities
          </div>
          {universities.map(uni => (
            <div
              key={uni.id}
              style={{
                padding: '16px 22px',
                borderLeft: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(uni.facilities ?? []).slice(0, 6).map(f => (
                  <span
                    key={f}
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      padding: '3px 9px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-full)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <CheckCircle size={11} style={{ color: 'var(--accent-gold)' }} /> {f}
                  </span>
                ))}
                {(uni.facilities ?? []).length > 6 && (
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', alignSelf: 'center', marginLeft: 4 }}>
                    +{(uni.facilities ?? []).length - 6} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
