'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, MapPin } from 'lucide-react';

interface SearchResult {
  type: 'university' | 'course' | 'county';
  id: string;
  label: string;
  sub?: string;
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) setResults(await res.json());
    }, 280);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    if (result.type === 'university') router.push(`/universities/${result.id}`);
    else if (result.type === 'course') router.push(`/courses?q=${encodeURIComponent(result.label)}`);
    else router.push(`/universities?county=${encodeURIComponent(result.label)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); setQuery(''); }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 16px', borderRadius: 'var(--radius-full)',
          background: 'var(--bg-secondary)', border: '1.5px solid var(--border-light)',
          color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '0.875rem',
          transition: 'var(--transition)',
        }}
        aria-label="Open search"
        id="global-search-btn"
      >
        <Search size={16} />
        <span>Search universities, courses…</span>
        <span style={{ marginLeft: 8, padding: '2px 6px', background: 'var(--border-light)', borderRadius: 4, fontSize: '0.75rem' }}>⌘K</span>
      </button>

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999 }}
            onClick={() => { setOpen(false); setQuery(''); }}
          />
          <div style={{
            position: 'fixed', top: '12vh', left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 580, zIndex: 1000,
            background: 'white', borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
              <Search size={20} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search universities, courses, counties, career fields…"
                style={{
                  flex: 1, border: 'none', outline: 'none', fontSize: '1rem',
                  color: 'var(--text-primary)', background: 'transparent',
                }}
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {results.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: '8px 0', maxHeight: 360, overflowY: 'auto' }}>
                {results.map(r => (
                  <li key={`${r.type}-${r.id}`}>
                    <button
                      onClick={() => handleSelect(r)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '12px 20px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 12,
                        transition: 'var(--transition)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <span style={{
                        padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem',
                        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                        background: r.type === 'university' ? 'var(--navy-light)' : r.type === 'course' ? 'var(--gold-glow)' : '#F0FDF4',
                        color: r.type === 'university' ? 'var(--navy-deep)' : r.type === 'course' ? 'var(--gold-primary)' : '#16a34a',
                        flexShrink: 0,
                      }}>
                        {r.type}
                      </span>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{r.label}</div>
                        {r.sub && <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{r.sub}</div>}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : query.length > 1 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                No results for "<strong>{query}</strong>"
              </div>
            ) : (
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: 4 }}>Quick Filters</div>
                {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'].map(c => (
                  <button key={c} onClick={() => handleSelect({ type: 'county', id: c, label: c })}
                    style={{ textAlign: 'left', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} /> {c} County</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
