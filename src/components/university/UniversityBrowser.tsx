'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Star, Users, MapPin, ArrowRight, Check, Scale, X, Filter, ChevronDown, Search } from 'lucide-react';
import type { University } from '@/lib/types';
import CampusPlate from './CampusPlate';

const COUNTIES = ['All', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Nyeri', 'Thika', 'Machakos', 'Kilifi', 'Garissa'];
const TYPES = ['All', 'Public', 'Private', 'Technical', 'TVET'];
const FACILITIES_OPTIONS = ['Library', 'Sports Complex', 'Hospital', 'Innovation Hub', 'Wi-Fi Campus', 'Laboratory', 'Hostel'];
const COMPARE_STORAGE_KEY = 'cck_compare_list';

interface Props {
  universities: University[];
  userHighSchool?: string | null;
  initialCounty?: string;
  initialQuery?: string;
  initialType?: string;
}

export default function UniversityBrowser({
  universities,
  userHighSchool,
  initialCounty,
  initialQuery,
  initialType,
}: Props) {
  const countyOptions = useMemo(() => {
    const dynamicCounties = Array.from(
      new Set([...COUNTIES.slice(1), ...universities.map(u => u.county).filter(Boolean)])
    ).sort();
    return ['All', ...dynamicCounties];
  }, [universities]);

  const [filtered, setFiltered] = useState<University[]>(universities);
  const [query, setQuery] = useState(initialQuery || '');
  const [county, setCounty] = useState(initialCounty || 'All');
  const [type, setType] = useState(initialType || 'All');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [compareList, setCompareList] = useState<University[]>([]);
  const resultsSummaryRef = useRef<HTMLDivElement>(null);

  const runFilterTransition = (updateFn: () => void, routeFocus = false) => {
    if (typeof document === 'undefined' || !('startViewTransition' in document)) {
      updateFn();
      if (routeFocus) resultsSummaryRef.current?.focus();
      return;
    }
    const transition = (document as Document & {
      startViewTransition: (cb: () => void) => { finished: Promise<void> };
    }).startViewTransition(() => {
      updateFn();
    });
    if (routeFocus) {
      transition.finished.finally(() => {
        resultsSummaryRef.current?.focus();
      });
    }
  };

  useEffect(() => {
    if (initialCounty !== undefined) setCounty(initialCounty || 'All');
  }, [initialCounty]);

  useEffect(() => {
    if (initialQuery !== undefined) setQuery(initialQuery || '');
  }, [initialQuery]);

  useEffect(() => {
    if (initialType !== undefined) setType(initialType || 'All');
  }, [initialType]);

  // Hydrate compare list from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (stored) {
        const parsed: { id: string }[] = JSON.parse(stored);
        const matched = parsed
          .map(item => universities.find(u => u.id === item.id))
          .filter((u): u is University => Boolean(u));
        if (matched.length > 0) setCompareList(matched.slice(0, 3));
      }
    } catch {}
  }, [universities]);

  useEffect(() => {
    let result = universities;
    if (query) result = result.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.county.toLowerCase().includes(query.toLowerCase()) || u.abbrev?.toLowerCase().includes(query.toLowerCase()));
    if (county !== 'All') result = result.filter(u => u.county.toLowerCase() === county.toLowerCase());
    if (type !== 'All') result = result.filter(u => u.type.toLowerCase() === type.toLowerCase());
    if (facilities.length > 0) result = result.filter(u => facilities.every(f => u.facilities?.some(uf => uf.toLowerCase().includes(f.toLowerCase()))));
    if (minRating > 0) result = result.filter(u => (u.rating ?? 0) >= minRating);
    setFiltered(result);
  }, [query, county, type, facilities, minRating, universities]);

  const toggleFacility = (f: string) =>
    runFilterTransition(() => setFacilities(prev => (prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])));
  const toggleCompare = (uni: University) => {
    setCompareList(prev => {
      const next = prev.find(u => u.id === uni.id)
        ? prev.filter(u => u.id !== uni.id)
        : prev.length >= 3
          ? prev
          : [...prev, uni];
      try {
        localStorage.setItem(
          COMPARE_STORAGE_KEY,
          JSON.stringify(next.map(u => ({ id: u.id, name: u.name, abbrev: u.abbrev || u.name })))
        );
      } catch {}
      return next;
    });
  };
  const clearFilters = () =>
    runFilterTransition(() => {
      setQuery('');
      setCounty('All');
      setType('All');
      setFacilities([]);
      setMinRating(0);
    }, true);
  const hasFilters = query || county !== 'All' || type !== 'All' || facilities.length > 0 || minRating > 0;

  return (
    <div>
      <style>{`
        .uni-browser-layout {
          display: grid;
          grid-template-columns: ${sidebarOpen ? '280px minmax(0, 1fr)' : 'minmax(0, 1fr)'};
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .uni-browser-layout {
            grid-template-columns: minmax(0, 1fr);
            gap: 24px;
          }
        }
      `}</style>
      <div className="uni-browser-layout">
        {/* Sidebar Filter */}
        {sidebarOpen && (
          <aside
            data-ui="directory-filter-panel"
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Filter Registry</h3>
              {hasFilters && (
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  Reset All
                </button>
              )}
            </div>

            <FilterSection title="County">
              <select
                value={county}
                onChange={e => runFilterTransition(() => setCounty(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border-medium)',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-primary)',
                  cursor: 'pointer',
                }}
              >
                {countyOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FilterSection>

            <FilterSection title="Institution Category">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TYPES.map(t => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.875rem', color: type === t ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: type === t ? 700 : 500 }}>
                    <input type="radio" name="type" value={t} checked={type === t} onChange={() => runFilterTransition(() => setType(t))} style={{ accentColor: 'var(--accent-gold)' }} />
                    {t}
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Campus Facilities">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {FACILITIES_OPTIONS.map(f => (
                  <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: facilities.includes(f) ? 'none' : '2px solid var(--border-medium)',
                        background: facilities.includes(f) ? 'var(--accent-gold)' : 'var(--bg-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleFacility(f)}
                    >
                      {facilities.includes(f) && <Check size={12} style={{ color: 'var(--gold-contrast-text)' }} />}
                    </div>
                    {f}
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title={<span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Min Rating: {minRating > 0 ? <>{minRating} <Star size={12} fill="var(--text-tertiary)" color="var(--text-tertiary)" /></> : 'Any'}</span>}>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={minRating}
                onChange={e => setMinRating(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                <span>Any</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>5 <Star size={10} fill="var(--text-tertiary)" color="var(--text-tertiary)" /></span>
              </div>
            </FilterSection>
          </aside>
        )}

        {/* Main Content */}
        <div>
          {/* Top Controls */}
          <div data-ui="directory-search-controls" style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by university name, county, or abbreviation..."
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border-medium)',
                  fontSize: '0.925rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  background: 'var(--bg-primary)',
                }}
              />
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Filter size={15} /> {sidebarOpen ? 'Hide' : 'Show'} Filters
            </button>
            {compareList.length >= 2 && (
              <Link href={`/compare?ids=${compareList.map(u => u.id).join(',')}`} className="btn btn-gold btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Scale size={15} /> Compare {compareList.length} Campuses
              </Link>
            )}
          </div>

          {/* Results Count */}
          <div
            ref={resultsSummaryRef}
            tabIndex={-1}
            style={{ marginBottom: 20, fontSize: '0.9rem', color: 'var(--text-secondary)', outline: 'none' }}
          >
            Showing <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of <span className="tabular-nums">{universities.length}</span> institutions
            {hasFilters && <span> · Filtered</span>}
          </div>

          {/* University Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 24 }}>
            {filtered.map(uni => {
              const isInCompare = compareList.some(u => u.id === uni.id);
              const alumniCount = userHighSchool ? (uni.id.length + userHighSchool.length + 3) * 2 : 0;

              return (
                <div key={uni.id} className="card scroll-reveal-card" style={{ position: 'relative', height: '100%' }}>
                  {/* Compare toggle */}
                  <button
                    onClick={() => toggleCompare(uni)}
                    title={isInCompare ? 'Remove from comparison' : compareList.length >= 3 ? 'Max 3 campuses' : 'Add to comparison'}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 2,
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      border: `2px solid ${isInCompare ? 'var(--gold-primary)' : 'rgba(246,245,242,0.5)'}`,
                      background: isInCompare ? 'var(--gold-primary)' : 'rgba(20,22,25,0.75)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isInCompare ? <Check size={14} style={{ color: '#141619' }} /> : <Scale size={14} style={{ color: '#F4F5F7' }} />}
                  </button>

                  <Link href={`/universities/${uni.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <CampusPlate
                      name={uni.name}
                      abbrev={uni.abbrev || uni.name.slice(0, 4).toUpperCase()}
                      county={uni.county}
                      type={uni.type}
                      established={uni.established}
                      image={uni.image}
                      height={196}
                      variant="card"
                    />
                    <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span className={`badge ${uni.type === 'Public' ? 'badge-navy' : 'badge-gold'}`}>{uni.type}</span>
                        <span className="tabular-nums" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>
                          Rank #{uni.ranking}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.28 }}>
                        {uni.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                        <MapPin size={13} /> {uni.county} County · <span className="tabular-nums">Est. {uni.established}</span>
                      </div>
                      {uni.rating && (
                        <div className="tabular-nums" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                          <Star size={14} fill="var(--gold-primary)" stroke="none" />
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{uni.rating.toFixed(1)}</span>
                          <span>({uni.reviewCount?.toLocaleString()} reviews)</span>
                        </div>
                      )}

                      {userHighSchool && (
                        <div style={{ padding: '8px 12px', background: 'var(--gold-glow)', borderRadius: 'var(--radius-sm)', marginBottom: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Users size={12} style={{ color: 'var(--gold-primary)' }} />
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {alumniCount} alumni from {userHighSchool}
                          </span>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 14, background: 'transparent' }}>
                        <div className="tabular-nums" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Users size={13} /> {uni.students}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          Inspect Campus <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
              <Search size={42} style={{ margin: '0 auto 16px', color: 'var(--text-tertiary)', display: 'block' }} />
              <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>No matching institutions</h3>
              <p>Try broadening your county or institution category filter.</p>
              <button onClick={clearFilters} className="btn btn-navy" style={{ marginTop: 20 }}>Reset Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--brand-navy)',
            borderRadius: 'var(--radius-full)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            zIndex: 100,
          }}
        >
          <Scale size={18} style={{ color: 'var(--gold-primary)' }} />
          <span style={{ color: '#F6F5F2', fontSize: '0.875rem' }}>
            <strong className="tabular-nums" style={{ color: 'var(--gold-primary)' }}>{compareList.length}</strong> campus{compareList.length > 1 ? 'es' : ''} selected
          </span>
          {compareList.map(u => (
            <span key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(246,245,242,0.12)', borderRadius: 'var(--radius-full)', padding: '4px 12px' }}>
              <span style={{ fontSize: '0.78rem', color: '#F6F5F2', fontWeight: 600 }}>{u.abbrev}</span>
              <button onClick={() => toggleCompare(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(246,245,242,0.75)', display: 'flex', padding: 0 }}>
                <X size={12} />
              </button>
            </span>
          ))}
          {compareList.length >= 2 && (
            <Link href={`/compare?ids=${compareList.map(u => u.id).join(',')}`} className="btn btn-gold btn-sm">
              Compare Side by Side
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 22, paddingBottom: 18 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: open ? 12 : 0 }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
        <ChevronDown size={14} style={{ color: 'var(--text-tertiary)', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>
      {open && children}
    </div>
  );
}
