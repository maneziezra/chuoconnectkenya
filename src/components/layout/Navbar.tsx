'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X, ChevronDown, BookOpen, Home, Calendar, Scale, Calculator, Landmark } from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';
import GlobalSearch from './GlobalSearch';
import { AnimatePresence, motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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
  { href: '/about', label: 'About' },
  { href: '/portal', label: 'Partner Portal', icon: <Landmark size={14} /> },
];

export default function Navbar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            marginTop: scrolled ? 0 : 8,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            transition: 'all 0.4s cubic-bezier(.16,1,.3,1)',
            background: scrolled ? 'rgba(255,255,255,0.92)' : '#FFFFFF',
            backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
            borderRadius: scrolled ? 0 : 16,
            border: scrolled ? 'none' : '2px solid var(--navy-deep)',
            boxShadow: scrolled
              ? '0 1px 3px rgba(0,0,0,0.06)'
              : '4px 4px 0px var(--navy-deep)',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5H7.5L3.5 12L7.5 19H12" stroke="var(--navy-deep)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 5H19.5L15.5 12L19.5 19H24" stroke="var(--gold-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em', fontFamily: "'Inter', sans-serif" }}>
              <span style={{ color: 'var(--navy-deep)' }}>Chuo</span>{' '}
              <span style={{ color: 'var(--gold-primary)' }}>Connect</span>
            </span>
          </Link>

          {/* Desktop Nav — center */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
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
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '6px 12px', fontSize: '13px', fontWeight: 600,
                        borderRadius: 10,
                        color: link.children.some(c => pathname.startsWith(c.href)) ? 'var(--navy-deep)' : 'var(--text-secondary)',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--navy-deep)';
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        if (!link.children!.some(c => pathname.startsWith(c.href))) {
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {link.label} <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: dropdown === link.label ? 'rotate(180deg)' : 'none', opacity: 0.6 }} />
                    </button>
                    <AnimatePresence>
                      {dropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          style={{ position: 'absolute', top: '100%', left: '50%', paddingTop: '10px', zIndex: 200, transform: 'translateX(-50%)' }}
                        >
                          <div
                            style={{
                              background: '#fff', borderRadius: 14,
                              border: '2px solid var(--navy-deep)',
                              boxShadow: '4px 4px 0px var(--navy-deep)',
                              minWidth: 230, overflow: 'hidden', padding: '6px'
                            }}
                          >
                          {link.children.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 14px', fontSize: '13px', borderRadius: 10,
                                color: pathname.startsWith(child.href) ? 'var(--navy-deep)' : 'var(--text-secondary)',
                                fontWeight: pathname.startsWith(child.href) ? 600 : 500,
                                background: pathname.startsWith(child.href) ? 'var(--gold-glow)' : 'transparent',
                                textDecoration: 'none', transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={e => { if (!pathname.startsWith(child.href)) { (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)'; (e.currentTarget as HTMLElement).style.color = 'var(--navy-deep)'; } }}
                              onMouseLeave={e => { if (!pathname.startsWith(child.href)) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; } }}
                            >
                              {child.icon && <span style={{ color: 'var(--gold-primary)', display: 'flex' }}>{child.icon}</span>}
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
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: '13px', fontWeight: 600, textDecoration: 'none',
                      padding: '6px 12px', borderRadius: 10,
                      color: pathname.startsWith(link.href!) ? 'var(--navy-deep)' : 'var(--text-secondary)',
                      background: pathname.startsWith(link.href!) ? 'var(--bg-secondary)' : 'transparent',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--navy-deep)';
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.startsWith(link.href!)) {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {link.icon && <span style={{ color: 'var(--gold-primary)', display: 'flex', opacity: 0.8 }}>{link.icon}</span>}
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Search + Actions — right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="desktop-nav">
              <GlobalSearch />
            </div>
            
            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {user ? (
                <>
                  <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ borderRadius: 12, fontSize: '13px', fontWeight: 600, border: '2px solid transparent' }}>Dashboard</Link>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ borderRadius: 12, fontSize: '13px', fontWeight: 600 }}>Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-ghost btn-sm" style={{ borderRadius: 12, fontSize: '13px', fontWeight: 600, border: '2px solid transparent' }}>Log in</Link>
                  <Link href="/signup" className="btn btn-gold btn-sm" style={{ borderRadius: 12, fontSize: '13px', fontWeight: 600 }}>Get Started</Link>
                </>
              )}
            </div>

            <button
              className="mobile-nav-btn"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--navy-deep)', display: 'none', padding: '4px'
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: 'fixed', top: '56px', left: 0, right: 0, bottom: 0,
              background: '#fff', zIndex: 99, padding: '24px', overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: '8px', 
              borderTop: '2px solid var(--navy-deep)',
            }}
          >
            {NAV_LINKS.map(link => (
              link.children ? (
                <div key={link.label} style={{ marginBottom: '8px' }}>
                  <div style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>
                    {link.label}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {link.children.map(child => (
                      <Link key={child.href} href={child.href}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', color: pathname.startsWith(child.href) ? 'var(--navy-deep)' : 'var(--text-secondary)', background: pathname.startsWith(child.href) ? 'var(--gold-glow)' : 'transparent', textDecoration: 'none' }}
                        onClick={() => setMobileOpen(false)}>
                        {child.icon && <span style={{ color: 'var(--gold-primary)', display: 'flex' }}>{child.icon}</span>}
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={link.href} href={link.href!}
                  style={{ padding: '12px 16px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', color: pathname.startsWith(link.href!) ? 'var(--navy-deep)' : 'var(--text-secondary)', background: pathname.startsWith(link.href!) ? 'var(--gold-glow)' : 'transparent', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '4px' }}
                  onClick={() => setMobileOpen(false)}>
                  {link.icon && <span style={{ color: 'var(--gold-primary)', display: 'flex' }}>{link.icon}</span>}
                  {link.label}
                </Link>
              )
            ))}
            
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '24px', borderTop: '2px solid var(--border-light)' }}>
              {user ? (
                <>
                  <Link href="/dashboard" className="btn btn-outline" style={{ borderRadius: 12, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn btn-outline" style={{ borderRadius: 12, justifyContent: 'center' }}>Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-outline" style={{ borderRadius: 12, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Log in</Link>
                  <Link href="/signup" className="btn btn-gold" style={{ borderRadius: 12, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
