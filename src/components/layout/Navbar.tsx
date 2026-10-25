'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap, Menu, X, ChevronDown, BookOpen, Home, Calendar, Scale, Calculator, Landmark, Moon, Sun } from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';
import GlobalSearch from './GlobalSearch';
import { AnimatePresence, motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from 'next-themes';

type NavLink = {
  href?: string;
  label: string;
  icon?: ReactNode;
  children?: { href: string; label: string; icon?: ReactNode }[];
};

const NAV_LINKS: NavLink[] = [
  { href: '/universities', label: 'Universities' },
  { href: '/courses', label: 'Courses' },
  {
    label: 'Resources',
    children: [
      { href: '/calculator', label: 'Points Calculator', icon: <Calculator size={16} /> },
      { href: '/grades', label: 'KCSE Grade Guides', icon: <GraduationCap size={16} /> },
      { href: '/guidance', label: 'Career Guidance', icon: <BookOpen size={16} /> },
      { href: '/scholarships', label: 'Scholarships', icon: <GraduationCap size={16} /> },
      { href: '/housing', label: 'Student Housing', icon: <Home size={16} /> },
      { href: '/events', label: 'Campus Events', icon: <Calendar size={16} /> },
      { href: '/compare', label: 'Compare Campuses', icon: <Scale size={16} /> },
    ],
  },
  { href: '/portal', label: 'Partner Portal', icon: <Landmark size={14} /> },
];

export default function Navbar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [mobileOpen]);

  return (
    <>
      <header
        data-ui="site-nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--bg-primary)',
          height: 'var(--nav-height)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--max-width)',
            width: '100%',
            margin: '0 auto',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(18px, 3.33vw, 48px)',
            gap: 16,
          }}
        >
          {/* Editorial Wordmark Block */}
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                borderRadius: 6,
                background: 'var(--brand-navy)',
                color: 'var(--gold-primary)',
                fontWeight: 800,
                fontSize: '0.9rem',
                letterSpacing: '-0.04em',
              }}
            >
              CC
            </span>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.035em', fontFamily: 'var(--font-serif)' }}>
              <span style={{ color: 'var(--text-primary)' }}>Chuo</span>
              <span style={{ color: 'var(--accent-gold)' }}>Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'var(--bg-secondary)',
              padding: '5px 8px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {NAV_LINKS.map(link => (
              <div
                key={link.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => link.children && setDropdown(link.label)}
                onMouseLeave={() => link.children && setDropdown(null)}
              >
                {link.children ? (
                  <>
                    <button
                      onClick={() => setDropdown(dropdown === link.label ? null : link.label)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px 14px',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-sm)',
                        color: link.children.some(c => pathname.startsWith(c.href)) ? 'var(--text-primary)' : 'var(--text-secondary)',
                        transition: 'background-color 0.18s ease, color 0.18s ease',
                      }}
                      className="nav-item-hover"
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        style={{
                          transition: 'transform 0.2s ease',
                          transform: dropdown === link.label ? 'rotate(180deg)' : 'none',
                          opacity: 0.75,
                        }}
                      />
                    </button>
                    <AnimatePresence>
                      {dropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            paddingTop: 10,
                            zIndex: 200,
                            transform: 'translateX(-50%)',
                          }}
                        >
                          <div
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '2px solid var(--border-medium)',
                              borderRadius: 'var(--radius-md)',
                              minWidth: 248,
                              overflow: 'hidden',
                              padding: 8,
                            }}
                          >
                            {link.children.map(child => (
                              <Link
                                key={child.href}
                                href={child.href}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
                                  padding: '11px 14px',
                                  fontSize: '0.88rem',
                                  borderRadius: 'var(--radius-sm)',
                                  color: pathname.startsWith(child.href) ? 'var(--accent-gold)' : 'var(--text-primary)',
                                  fontWeight: pathname.startsWith(child.href) ? 700 : 500,
                                  background: pathname.startsWith(child.href) ? 'var(--bg-tertiary)' : 'transparent',
                                  textDecoration: 'none',
                                  transition: 'background-color 0.15s ease, color 0.15s ease',
                                }}
                                className="dropdown-item-hover"
                              >
                                {child.icon && <span style={{ color: 'var(--accent-gold)', display: 'flex' }} aria-hidden="true">{child.icon}</span>}
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={link.href!}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      color: pathname.startsWith(link.href!) ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: pathname.startsWith(link.href!) ? 'var(--bg-primary)' : 'transparent',
                      transition: 'background-color 0.18s ease, color 0.18s ease',
                    }}
                    className="nav-item-hover"
                  >
                    {link.icon && <span style={{ color: 'var(--accent-gold)', display: 'flex' }} aria-hidden="true">{link.icon}</span>}
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Search + Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="desktop-nav">
              <GlobalSearch />
            </div>

            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="btn-ghost"
                  style={{ padding: 9, borderRadius: '50%', display: 'flex', cursor: 'pointer' }}
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}

              {user ? (
                <>
                  <Link href="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-ghost btn-sm">Log in</Link>
                  <Link href="/calculator" className="btn btn-gold btn-sm">Calculate Points</Link>
                </>
              )}
            </div>

            <button
              className="mobile-nav-btn"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'var(--bg-secondary)',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                display: 'none',
                padding: 10,
                borderRadius: 'var(--radius-sm)',
                zIndex: 200,
              }}
            >
              {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'var(--bg-primary)',
              zIndex: 99,
              padding: '92px 24px 24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <GlobalSearch />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {NAV_LINKS.map(link => (
                  <div key={link.label}>
                    {link.children ? (
                      <div>
                        <div style={{ padding: '8px 12px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                          {link.label}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                          {link.children.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 14,
                                padding: '14px 16px',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 600,
                                fontSize: '0.96rem',
                                color: pathname.startsWith(child.href) ? 'var(--text-inverse)' : 'var(--text-primary)',
                                background: pathname.startsWith(child.href) ? 'var(--accent-main)' : 'var(--bg-secondary)',
                                textDecoration: 'none',
                              }}
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.icon && <span style={{ color: 'var(--accent-gold)', display: 'flex' }} aria-hidden="true">{child.icon}</span>}
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.href!}
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: 600,
                          fontSize: '0.96rem',
                          color: pathname.startsWith(link.href!) ? 'var(--text-inverse)' : 'var(--text-primary)',
                          background: pathname.startsWith(link.href!) ? 'var(--accent-main)' : 'var(--bg-secondary)',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                        }}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.icon && <span style={{ color: 'var(--accent-gold)', display: 'flex' }} aria-hidden="true">{link.icon}</span>}
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 28 }}>
                {mounted && (
                  <button
                    onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setMobileOpen(false); }}
                    className="btn btn-outline"
                    style={{ width: '100%', marginBottom: 14, display: 'flex', gap: 10 }}
                  >
                    {theme === 'dark' ? <><Sun size={18} /> Switch to Light Mode</> : <><Moon size={18} /> Switch to Dark Mode</>}
                  </button>
                )}

                {user ? (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Link href="/dashboard" className="btn btn-gold" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn btn-outline" style={{ flex: 1 }}>Sign out</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Link href="/login" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>Log in</Link>
                    <Link href="/calculator" className="btn btn-gold" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>Calculate Points</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 990px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: flex !important; }
        }
        .nav-item-hover:hover {
          background: var(--bg-primary) !important;
          color: var(--text-primary) !important;
        }
        .dropdown-item-hover:hover {
          background: var(--bg-tertiary) !important;
        }
      `}</style>
    </>
  );
}
