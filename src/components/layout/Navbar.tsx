'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X, ChevronDown, BookOpen, Home, Calendar, Scale, Calculator, Landmark, Moon, Sun } from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';
import GlobalSearch from './GlobalSearch';
import { AnimatePresence, motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

type NavLink = {
  href?: string;
  label: string;
  icon?: ReactNode;
  children?: { href: string; label: string; icon?: ReactNode; }[];
};

const NAV_LINKS: NavLink[] = [
  { href: '/universities', label: 'Universities' },
  { href: '/courses', label: 'Courses' },
  {
    label: 'Resources',
    children: [
      { href: '/guidance', label: 'Career Guidance', icon: <BookOpen size={16} /> },
      { href: '/scholarships', label: 'Scholarships', icon: <GraduationCap size={16} /> },
      { href: '/housing', label: 'Student Housing', icon: <Home size={16} /> },
      { href: '/events', label: 'Campus Events', icon: <Calendar size={16} /> },
      { href: '/compare', label: 'Compare Campuses', icon: <Scale size={16} /> },
      { href: '/calculator', label: 'Points Calculator', icon: <Calculator size={16} /> },
    ],
  },
  { href: '/portal', label: 'Partner Portal', icon: <Landmark size={14} /> },
];

export default function Navbar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [mobileOpen]);

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 16px',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            marginTop: scrolled ? 0 : 12,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            transition: 'all 0.4s cubic-bezier(.16,1,.3,1)',
            background: scrolled ? 'var(--bg-primary)' : 'var(--bg-primary)',
            opacity: scrolled ? 0.95 : 1,
            backdropFilter: scrolled ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
            borderRadius: scrolled ? 0 : 20,
            border: `1px solid ${scrolled ? 'var(--border-light)' : 'var(--border-medium)'}`,
            boxShadow: scrolled ? 'var(--shadow-sm)' : 'var(--shadow-md)',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5H7.5L3.5 12L7.5 19H12" stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 5H19.5L15.5 12L19.5 19H24" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em', fontFamily: "'Inter', sans-serif" }}>
              <span style={{ color: 'var(--text-primary)' }}>Chuo</span>
              <span style={{ color: 'var(--accent-gold)' }}>Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
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
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '8px 16px', fontSize: '14px', fontWeight: 600,
                        borderRadius: '12px',
                        color: link.children.some(c => pathname.startsWith(c.href)) ? 'var(--text-primary)' : 'var(--text-secondary)',
                        transition: 'all 0.2s',
                      }}
                      className="nav-item-hover"
                    >
                      {link.label} <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: dropdown === link.label ? 'rotate(180deg)' : 'none', opacity: 0.7 }} />
                    </button>
                    <AnimatePresence>
                      {dropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          style={{ position: 'absolute', top: '100%', left: '50%', paddingTop: '12px', zIndex: 200, transform: 'translateX(-50%)' }}
                        >
                          <div
                            style={{
                              background: 'var(--bg-primary)', borderRadius: '16px',
                              border: '1px solid var(--border-light)',
                              boxShadow: 'var(--shadow-lg)',
                              minWidth: 240, overflow: 'hidden', padding: '8px'
                            }}
                          >
                          {link.children.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '12px 16px', fontSize: '14px', borderRadius: '12px',
                                color: pathname.startsWith(child.href) ? 'var(--accent-gold)' : 'var(--text-primary)',
                                fontWeight: pathname.startsWith(child.href) ? 700 : 500,
                                background: pathname.startsWith(child.href) ? 'var(--bg-secondary)' : 'transparent',
                                textDecoration: 'none', transition: 'all 0.15s ease',
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
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                      padding: '8px 16px', borderRadius: '12px',
                      color: pathname.startsWith(link.href!) ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: pathname.startsWith(link.href!) ? 'var(--bg-secondary)' : 'transparent',
                      transition: 'all 0.2s',
                    }}
                    className="nav-item-hover"
                  >
                    {link.icon && <span style={{ color: 'var(--accent-gold)', display: 'flex', opacity: 0.9 }} aria-hidden="true">{link.icon}</span>}
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Search + Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="desktop-nav">
              <GlobalSearch />
            </div>
            
            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="btn-ghost"
                  style={{ padding: '8px', borderRadius: '50%', display: 'flex', cursor: 'pointer' }}
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
                  <Link href="/signup" className="btn btn-gold btn-sm">Get Started</Link>
                </>
              )}
            </div>

            <button
              className="mobile-nav-btn"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', cursor: 'pointer',
                color: 'var(--text-primary)', display: 'none', padding: '10px', borderRadius: '12px',
                zIndex: 200
              }}
            >
              {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen Animated Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'var(--bg-primary)', zIndex: 99, 
              padding: '100px 24px 24px', overflowY: 'auto',
              display: 'flex', flexDirection: 'column'
            }}
          >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ padding: '0 8px' }}>
                <GlobalSearch />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {NAV_LINKS.map(link => (
                  <div key={link.label}>
                    {link.children ? (
                      <div>
                        <div style={{ padding: '8px 12px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>
                          {link.label}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                          {link.children.map(child => (
                            <Link key={child.href} href={child.href}
                              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', borderRadius: '16px', fontWeight: 600, fontSize: '16px', color: pathname.startsWith(child.href) ? 'var(--text-inverse)' : 'var(--text-primary)', background: pathname.startsWith(child.href) ? 'var(--accent-main)' : 'var(--bg-secondary)', textDecoration: 'none' }}
                              onClick={() => setMobileOpen(false)}>
                              {child.icon && <span style={{ color: pathname.startsWith(child.href) ? 'var(--accent-gold)' : 'var(--accent-gold)', display: 'flex' }} aria-hidden="true">{child.icon}</span>}
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link href={link.href!}
                        style={{ padding: '18px 16px', borderRadius: '16px', fontWeight: 600, fontSize: '16px', color: pathname.startsWith(link.href!) ? 'var(--text-inverse)' : 'var(--text-primary)', background: pathname.startsWith(link.href!) ? 'var(--accent-main)' : 'var(--bg-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}
                        onClick={() => setMobileOpen(false)}>
                        {link.icon && <span style={{ color: 'var(--accent-gold)', display: 'flex' }} aria-hidden="true">{link.icon}</span>}
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                {mounted && (
                   <button
                   onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setMobileOpen(false); }}
                   className="btn btn-outline" style={{ width: '100%', marginBottom: 16, display: 'flex', gap: 10 }}
                 >
                   {theme === 'dark' ? <><Sun size={18}/> Switch to Light Mode</> : <><Moon size={18}/> Switch to Dark Mode</>}
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
                    <Link href="/signup" className="btn btn-gold" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>Get Started</Link>
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
          background: var(--bg-secondary) !important;
          color: var(--text-primary) !important;
        }
        .dropdown-item-hover:hover {
          background: var(--bg-tertiary) !important;
        }
      `}</style>
    </>
  );
}
