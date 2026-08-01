'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Users, MapPin, ArrowRight, Check, Scale, X, Filter, ChevronDown, Search } from 'lucide-react';
import type { University } from '@/lib/types';

const COUNTIES = ['All', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Nyeri', 'Thika', 'Machakos', 'Kilifi', 'Garissa'];
const TYPES = ['All', 'Public', 'Private', 'Technical', 'TVET'];
const FACILITIES_OPTIONS = ['Library', 'Sports Complex', 'Hospital', 'Innovation Hub', 'Wi-Fi Campus', 'Laboratory', 'Hostel'];

interface Props {
  universities: University[];
  userHighSchool?: string | null;
}

export default function UniversityBrowser({ universities, userHighSchool }: Props) {
  const [filtered, setFiltered] = useState<University[]>(universities);
  const [query, setQuery] = useState('');
  const [county, setCounty] = useState('All');
  const [type, setType] = useState('All');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [compareList, setCompareList] = useState<University[]>([]);

  useEffect(() => {
    let result = universities;
    if (query) result = result.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.county.toLowerCase().includes(query.toLowerCase()) || u.abbrev?.toLowerCase().includes(query.toLowerCase()));
    if (county !== 'All') result = result.filter(u => u.county === county);
    if (type !== 'All') result = result.filter(u => u.type === type);
    if (facilities.length > 0) result = result.filter(u => facilities.every(f => u.facilities?.some(uf => uf.toLowerCase().includes(f.toLowerCase()))));
    if (minRating > 0) result = result.filter(u => (u.rating ?? 0) >= minRating);
    setFiltered(result);
  }, [query, county, type, facilities, minRating, universities]);

  const toggleFacility = (f: string) => setFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  const toggleCompare = (uni: University) => {
    setCompareList(prev => {
      if (prev.find(u => u.id === uni.id)) return prev.filter(u => u.id !== uni.id);
      if (prev.length >= 3) return prev;
      return [...prev, uni];
    });
  };
  const clearFilters = () => { setQuery(''); setCounty('All'); setType('All'); setFacilities([]); setMinRating(0); };
  const hasFilters = query || county !== 'All' || type !== 'All' || facilities.length > 0 || minRating > 0;

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: sidebarOpen ? '280px 1fr' : '0 1fr', gap: 32, alignItems: 'start', transition: 'grid-template-columns 0.3s ease' }}>
        
        {/* Sidebar Filter */}
        <aside style={{
          background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)', padding: 24, position: 'sticky', top: 'calc(var(--nav-height) + 16px)',
          overflow: 'hidden', opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.3s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Filter Results</h3>
            {hasFilters && (
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
                Clear All
              </button>
            )}
          </div>

          <FilterSection title="County">
            <select value={county} onChange={e => setCounty(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-light)', fontSize: '0.875rem', color: 'var(--text-primary)', background: 'var(--bg-primary)', cursor: 'pointer' }}>
              {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FilterSection>

          <FilterSection title="Institution Type">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TYPES.map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.875rem', color: type === t ? 'var(--navy-deep)' : 'var(--text-secondary)', fontWeight: type === t ? 600 : 400 }}>
                  <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} style={{ accentColor: 'var(--navy-deep)' }} />
                  {t}
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Facilities">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FACILITIES_OPTIONS.map(f => (
                <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 4, border: facilities.includes(f) ? 'none' : '1.5px solid var(--border-medium)',
                    background: facilities.includes(f) ? 'var(--navy-deep)' : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer',
                  }} onClick={() => toggleFacility(f)}>
                    {facilities.includes(f) && <Check size={11} style={{ color: '#FFFFFF' }} />}
                  </div>
                  {f}
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title={<span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Min Rating: {minRating > 0 ? <>{minRating} <Star size={12} fill="var(--text-tertiary)" color="var(--text-tertiary)" /></> : 'Any'}</span>}>
            <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={e => setMinRating(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--gold-primary)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              <span>Any</span><span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>5 <Star size={10} fill="var(--text-tertiary)" color="var(--text-tertiary)" /></span>
            </div>
          </FilterSection>
        </aside>

        {/* Main Content */}
        <div>
          {/* Top Controls */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name, county, abbreviation…"
                style={{
                  width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-full)',
                  border: '1.5px solid var(--border-light)', fontSize: '0.875rem',
                  outline: 'none', background: 'var(--bg-primary)',
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
          <div style={{ marginBottom: 20, fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of {universities.length} institutions
            {hasFilters && <span> · Filters applied</span>}
          </div>

          {/* University Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20 }}>
            {filtered.map(uni => {
              const isInCompare = compareList.some(u => u.id === uni.id);
              // Pseudo-random number based on uni id length and high school length
              const alumniCount = userHighSchool ? (uni.id.length + userHighSchool.length + 3) * 2 : 0;
              
              return (
                <div key={uni.id} className="card" style={{ position: 'relative', height: '100%' }}>
                  {/* Compare toggle */}
                  <button
                    onClick={() => toggleCompare(uni)}
                    title={isInCompare ? 'Remove from comparison' : compareList.length >= 3 ? 'Max 3 campuses' : 'Add to comparison'}
                    style={{
                      position: 'absolute', top: 12, right: 12, zIndex: 2,
                      width: 32, height: 32, borderRadius: '50%', border: `2px solid ${isInCompare ? 'var(--gold-primary)' : 'rgba(255,255,255,0.6)'}`,
                      background: isInCompare ? 'var(--gold-primary)' : 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(8px)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {isInCompare ? <Check size={14} style={{ color: '#FFFFFF' }} /> : <Scale size={14} style={{ color: 'var(--text-tertiary)' }} />}
                  </button>

                  <Link href={`/universities/${uni.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <img src={uni.image} alt={`${uni.name}`} className="uni-card-image" />
                    <div className="card-body" style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <span className={`badge ${uni.type === 'Public' ? 'badge-navy' : 'badge-gold'}`}>{uni.type}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Rank #{uni.ranking}</span>
                      </div>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.3 }}>{uni.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: 12 }}>
                        <MapPin size={12} /> {uni.county} County · Est. {uni.established}
                      </div>
                      {uni.rating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                          <Star size={14} fill="var(--gold-primary)" stroke="none" />
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{uni.rating.toFixed(1)}</span>
                          <span>({uni.reviewCount?.toLocaleString()} reviews)</span>
                        </div>
                      )}
                      
                      {userHighSchool && (
                        <div style={{ padding: '6px 12px', background: 'var(--gold-glow)', borderRadius: 'var(--radius-md)', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(199,155,55,0.2)' }}>
                          <Users size={12} style={{ color: 'var(--gold-primary)' }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {alumniCount} alumni from {userHighSchool}
                          </span>
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Users size={12} /> {uni.students}
                        </div>
                        <span style={{ fontSize: '0.83rem', color: 'var(--gold-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          View Profile <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-tertiary)' }}>
              <Search size={48} style={{ margin: '0 auto 16px', color: 'var(--text-tertiary)', display: 'block' }} />
              <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>No results found</h3>
              <p>Try adjusting your filters or search term.</p>
              <button onClick={clearFilters} className="btn btn-navy" style={{ marginTop: 20 }}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--navy-deep)', borderRadius: 'var(--radius-full)',
          padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: 'var(--shadow-xl)', zIndex: 100, border: '1px solid rgba(199,155,55,0.3)',
        }}>
          <Scale size={18} style={{ color: 'var(--gold-primary)' }} />
          <span style={{ color: '#FFFFFF', fontSize: '0.875rem' }}>
            <strong style={{ color: 'var(--gold-primary)' }}>{compareList.length}</strong> campus{compareList.length > 1 ? 'es' : ''} selected for comparison
          </span>
          {compareList.map(u => (
            <span key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', padding: '4px 12px' }}>
              <span style={{ fontSize: '0.78rem', color: '#FFFFFF' }}>{u.abbrev}</span>
              <button onClick={() => toggleCompare(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', padding: 0 }}>
                <X size={12} />
              </button>
            </span>
          ))}
          {compareList.length >= 2 && (
            <Link href={`/compare?ids=${compareList.map(u => u.id).join(',')}`} className="btn btn-gold btn-sm">
              Compare Now →
            </Link>
          )}
        </div>
      )}
    </>
  );
}

function FilterSection({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: open ? 12 : 0 }}
      >
        <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>{title}</span>
        <ChevronDown size={14} style={{ color: 'var(--text-tertiary)', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>
      {open && children}
    </div>
  );
}
