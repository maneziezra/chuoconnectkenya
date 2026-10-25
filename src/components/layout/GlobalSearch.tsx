'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Award, Calculator } from 'lucide-react';

interface SearchResult {
  type: 'university' | 'course' | 'county' | 'grade' | 'scholarship';
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
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(prev => {
          const next = !prev;
          if (next) setTimeout(() => inputRef.current?.focus(), 50);
          return next;
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) setResults(await res.json());
      } catch (err) {
        console.error('Search fetch error:', err);
      }
    }, 220);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    if (result.type === 'university') router.push(`/universities/${result.id}`);
    else if (result.type === 'course') router.push(`/courses?q=${encodeURIComponent(result.label)}`);
    else if (result.type === 'grade') router.push(`/grades/${result.id}`);
    else if (result.type === 'scholarship') router.push('/scholarships');
    else router.push(`/universities?county=${encodeURIComponent(result.label)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); setQuery(''); }
  };

  const getBadgeStyle = (type: SearchResult['type']) => {
    if (type === 'university') return { background: 'var(--navy-light)', color: 'var(--navy-deep)' };
    if (type === 'course') return { background: 'var(--gold-glow)', color: 'var(--gold-primary)' };
    if (type === 'grade') return { background: 'var(--success-bg)', color: 'var(--success-text)' };
    if (type === 'scholarship') return { background: 'var(--navy-deep)', color: 'var(--gold-primary)' };
    return { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' };
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Apple Spotlight Trigger Pill */}
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="apple-search-trigger"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '4px 12px',
          height: 28,
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-light)',
          borderTop: '1px solid var(--apple-glass-highlight)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          fontSize: '0.8125rem',
          fontWeight: 500,
          boxShadow: 'var(--shadow-sm)',
          transition: 'transform var(--apple-press), background var(--apple-ease), border-color var(--apple-ease), box-shadow var(--apple-ease)',
          letterSpacing: '-0.01em',
        }}
        aria-label="Open search command palette"
        id="global-search-btn"
      >
        <Search size={13} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
        <span>Search universities, courses…</span>
        <span
          style={{
            marginLeft: 6,
            padding: '1px 6px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            color: 'var(--text-tertiary)',
            letterSpacing: '0.02em',
          }}
        >
          ⌘K
        </span>
      </button>

      {/* Apple Spotlight Palette Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Frosted Glass Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(11, 17, 32, 0.42)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                zIndex: 999,
              }}
              onClick={() => { setOpen(false); setQuery(''); }}
            />

            {/* Elevated Glass Island */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: '12vh',
                left: '50%',
                x: '-50%',
                width: 'calc(100% - 32px)',
                maxWidth: 600,
                zIndex: 1000,
                transformOrigin: 'top center',
                background: 'var(--apple-glass-bg)',
                backdropFilter: 'blur(28px) saturate(190%)',
                WebkitBackdropFilter: 'blur(28px) saturate(190%)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 24px 60px -12px rgba(11, 17, 32, 0.32), 0 8px 24px -4px rgba(11, 17, 32, 0.16)',
                overflow: 'hidden',
              }}
            >
              {/* Search Bar Input */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '18px 22px',
                  borderBottom: '1px solid var(--border-light)',
                  background: 'transparent',
                }}
              >
                <Search size={20} aria-hidden="true" style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search universities, courses, KCSE grades (C+, B+), scholarships…"
                  aria-label="Search query"
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    letterSpacing: '-0.015em',
                    color: 'var(--text-primary)',
                    background: 'transparent',
                  }}
                />
                {query ? (
                  <button
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-full)',
                      width: 26,
                      height: 26,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)',
                      transition: 'transform var(--apple-press)',
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                ) : (
                  <span
                    style={{
                      padding: '3px 7px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: 'var(--text-tertiary)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    ESC
                  </span>
                )}
              </div>

              {/* Dynamic Results List */}
              {results.length > 0 ? (
                <ul
                  style={{
                    listStyle: 'none',
                    padding: '8px',
                    margin: 0,
                    maxHeight: 400,
                    overflowY: 'auto',
                    overscrollBehavior: 'contain',
                  }}
                >
                  {results.map(r => {
                    const badgeStyle = getBadgeStyle(r.type);
                    return (
                      <li key={`${r.type}-${r.id}`} style={{ margin: '2px 0' }}>
                        <button
                          onClick={() => handleSelect(r)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '12px 16px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            transition: 'transform var(--apple-press), background var(--apple-ease)',
                          }}
                          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
                          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              ...badgeStyle,
                              flexShrink: 0,
                            }}
                          >
                            {r.type}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {r.label}
                            </div>
                            {r.sub && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                                {r.sub}
                              </div>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : query.length > 1 ? (
                <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  No results found for &ldquo;<strong style={{ color: 'var(--text-primary)' }}>{query}</strong>&rdquo;
                </div>
              ) : (
                /* Default Suggestions / Quick Matchers */
                <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: 'var(--text-tertiary)',
                        marginBottom: 10,
                      }}
                    >
                      KCSE Grade Guides & Placement Tools
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {[
                        { label: 'KUCCPS Calculator', href: '/calculator', icon: <Calculator size={13} /> },
                        { label: 'Grade C+ Guide', href: '/grades/c-plus', icon: <Award size={13} /> },
                        { label: 'Grade B+ Guide', href: '/grades/b-plus', icon: <Award size={13} /> },
                        { label: 'Grade C (Diploma)', href: '/grades/c', icon: <Award size={13} /> },
                        { label: '2026 Scholarships', href: '/scholarships', icon: <Award size={13} /> },
                      ].map(item => (
                        <button
                          key={item.href}
                          onClick={() => { setOpen(false); setQuery(''); router.push(item.href); }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '8px 14px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--gold-glow)',
                            border: '1px solid var(--border-light)',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            transition: 'transform var(--apple-press), background var(--apple-ease)',
                          }}
                          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
                          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.04)'}
                          onMouseLeave={e => {
                            e.currentTarget.style.filter = 'none';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          {item.icon} {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: 'var(--text-tertiary)',
                        marginBottom: 10,
                      }}
                    >
                      Browse by County
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                      {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'].map(c => (
                        <button
                          key={c}
                          onClick={() => handleSelect({ type: 'county', id: c, label: c })}
                          style={{
                            textAlign: 'left',
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-light)',
                            cursor: 'pointer',
                            fontSize: '0.86rem',
                            fontWeight: 500,
                            color: 'var(--text-secondary)',
                            transition: 'transform var(--apple-press), background var(--apple-ease)',
                          }}
                          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-primary)')}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'var(--bg-secondary)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <MapPin size={14} aria-hidden="true" style={{ color: 'var(--gold-primary)' }} />
                            <span>{c} County</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
