import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Star, Award, ArrowRight,
  Home, Calendar, Scale, MapPin, Calculator, Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { University } from '@/lib/types';
import { universitiesData } from '@/lib/data/universities';
import { GRADE_GUIDES } from '@/lib/data/gradeGuides';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import { StaggerItem } from '@/components/animations/StaggerItem';
import { HoverScale } from '@/components/animations/HoverScale';
import HeroSection from '@/components/home/HeroSection';

export const metadata: Metadata = {
  title: {
    absolute: 'Chuo Connect Kenya — Discover Your University, KUCCPS Cluster Points & Scholarships',
  },
  description:
    'Find and compare every university in Kenya. Calculate your KUCCPS 2026 cluster points, check HEF Band 1–5 fees, explore KCSE grade guides, and apply directly.'
};

const FEATURES = [
  {
    icon: <Calculator size={22} aria-hidden="true" />,
    title: 'KUCCPS Cluster & HEF Calculator',
    desc: 'Compute your official 48-point weighted cluster score across all 8 groups and simulate your HEF Band 1–5 household fee.',
    href: '/calculator'
  },
  {
    icon: <Search size={22} aria-hidden="true" />,
    title: 'Deep Campus Profiles',
    desc: 'Accommodation, labs, clubs, sports, fees, virtual tours, and direct admissions inquiry — all in one profile.',
    href: '/universities'
  },
  {
    icon: <Scale size={22} aria-hidden="true" />,
    title: 'Side-by-Side Comparison',
    desc: 'Evaluate institutions side-by-side across tuition fees, programmes, facilities, ratings, and student life.',
    href: '/compare'
  },
  {
    icon: <Award size={22} aria-hidden="true" />,
    title: 'Funding & Scholarships',
    desc: 'Discover Equity Wings to Fly, Elimu, HELB/HEF grants, Mastercard Foundation, and private bursaries.',
    href: '/scholarships'
  },
  {
    icon: <Home size={22} aria-hidden="true" />,
    title: 'Verified Student Housing',
    desc: 'Filter Qwetu, Qejani, and vetted campus hostels by university proximity and book viewings on WhatsApp.',
    href: '/housing'
  },
  {
    icon: <Calendar size={22} aria-hidden="true" />,
    title: 'Campus Open Days & Fairs',
    desc: 'RSVP for 2026/2027 university open days, KUCCPS revision clinics, hackathons, and career fairs across Kenya.',
    href: '/events'
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.from('universities').select('*').order('ranking', { ascending: true }).limit(3);
  const rawUnis = data && data.length > 0 ? data : universitiesData.slice(0, 3);
  const featuredUnis = rawUnis.map((u: any) => ({
    ...u,
    image: u.coverUrl || u.logoUrl || u.image || '/images/universities/uon.jpg'
  })) as University[];

  return (
    <>
      {/* ── HERO SECTION ── */}
      <HeroSection />

      {/* ── KCSE GRADE QUICK-MATCHER STRIP ── */}
      <section style={{ padding: '44px 20px 0' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '32px 36px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            boxShadow: 'var(--shadow-md)',
            background: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--gold-primary)',
                  marginBottom: 6,
                }}
              >
                <Sparkles size={13} /> 2026 KCSE Placement & Bridging Guides
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                }}
              >
                What Mean Grade Did You Score in KCSE?
              </h2>
            </div>
            <Link href="/calculator" className="btn btn-navy btn-sm" style={{ borderRadius: 'var(--radius-md)' }}>
              <Calculator size={15} /> Open Full KUCCPS Calculator
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 12 }}>
            {GRADE_GUIDES.map(guide => (
              <Link
                key={guide.slug}
                href={`/grades/${guide.slug}`}
                style={{
                  textDecoration: 'none',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  transition: 'transform var(--apple-press), background var(--apple-ease), box-shadow var(--apple-ease)',
                }}
                className="apple-quick-grade-card"
              >
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '1.08rem',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-serif)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Grade {guide.gradeLabel}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600, marginTop: 2 }}>
                    {guide.isDegreeEligible ? 'Direct Degree Entry' : 'Diploma & TVET Bridge'}
                  </div>
                </div>
                <ArrowRight size={15} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div style={{ padding: '0 20px' }}>
          <div
            style={{
              border: '1px solid var(--border-light)',
              borderTop: '1px solid var(--apple-glass-highlight)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)',
              background: 'var(--bg-secondary)',
              padding: '64px 32px',
              maxWidth: 1200,
              margin: '0 auto',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <h2
                className="text-h2"
                style={{
                  marginBottom: 16,
                  letterSpacing: '-0.028em',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                Everything you need to make the right choice
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  maxWidth: 620,
                  margin: '0 auto',
                  lineHeight: 1.65,
                  fontSize: '1.02rem',
                }}
              >
                We bring together all the data, insights, and community tools required to navigate Kenya&apos;s higher education landscape with confidence.
              </p>
            </div>

            <StaggerContainer
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: 24,
                maxWidth: 1040,
                margin: '0 auto',
              }}
            >
              {FEATURES.map((feat, i) => (
                <StaggerItem key={i}>
                  <HoverScale scale={1.02} className="h-full">
                    <Link
                      href={feat.href}
                      className="card"
                      style={{
                        display: 'block',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        height: '100%',
                        padding: 28,
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-light)',
                        borderTop: '1px solid var(--apple-glass-highlight)',
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          border: '1px solid var(--border-light)',
                          borderTop: '1px solid var(--apple-glass-highlight)',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--gold-glow)',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 20,
                        }}
                      >
                        {feat.icon}
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.25rem',
                          color: 'var(--text-primary)',
                          letterSpacing: '-0.02em',
                          marginBottom: 12,
                        }}
                      >
                        {feat.title}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.62, fontSize: '0.94rem' }}>
                        {feat.desc}
                      </p>
                    </Link>
                  </HoverScale>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ── TOP UNIVERSITIES ── */}
      <section className="section heavy-section-deferred" style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
            opacity: 0.035,
            pointerEvents: 'none',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <FadeIn direction="up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2
                  className="text-h2"
                  style={{
                    marginBottom: 10,
                    letterSpacing: '-0.028em',
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  Top Rated Campuses
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                  Based on thousands of verified student and parent reviews.
                </p>
              </div>
              <HoverScale>
                <Link
                  href="/universities"
                  className="btn btn-outline"
                  style={{ display: 'flex', gap: 8, borderRadius: 'var(--radius-md)' }}
                >
                  View All <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </HoverScale>
            </div>
          </FadeIn>

          <StaggerContainer
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 32,
            }}
          >
            {featuredUnis.length > 0 ? featuredUnis.map(uni => (
              <StaggerItem key={uni.id}>
                <HoverScale scale={1.02} className="h-full">
                  <Link
                    href={`/universities/${uni.id}`}
                    className="card scroll-reveal-card"
                    style={{
                      overflow: 'hidden',
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-light)',
                      borderTop: '1px solid var(--apple-glass-highlight)',
                    }}
                  >
                    <div style={{ height: 210, position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={uni.image}
                        alt={uni.name}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 14,
                          right: 14,
                          background: 'var(--apple-glass-bg)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)',
                          padding: '5px 11px',
                          border: '1px solid var(--border-light)',
                          borderTop: '1px solid var(--apple-glass-highlight)',
                          borderRadius: 'var(--radius-sm)',
                          boxShadow: 'var(--shadow-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                        }}
                      >
                        <Star size={14} aria-hidden="true" style={{ color: 'var(--gold-primary)', fill: 'var(--gold-primary)' }} />
                        {uni.rating?.toFixed(1) || 'N/A'}
                      </div>
                    </div>
                    <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span
                          className={`badge ${uni.type === 'Public' ? 'badge-navy' : 'badge-gold'}`}
                          style={{
                            borderRadius: 'var(--radius-sm)',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            fontSize: '0.72rem',
                          }}
                        >
                          {uni.type}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                          Est. {uni.established}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.25rem',
                          color: 'var(--text-primary)',
                          marginBottom: 8,
                          lineHeight: 1.35,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {uni.name}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
                        {uni.overview?.substring(0, 105)}...
                      </p>
                      
                      <div
                        style={{
                          paddingTop: 16,
                          borderTop: '1px solid var(--border-light)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '0.84rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <MapPin size={14} aria-hidden="true" style={{ color: 'var(--gold-primary)' }} /> {uni.county}
                        </span>
                        <span style={{ color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '-0.01em' }}>
                          View Profile →
                        </span>
                      </div>
                    </div>
                  </Link>
                </HoverScale>
              </StaggerItem>
            )) : (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '60px',
                  textAlign: 'center',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Populate Supabase with mock universities to see them here.</p>
              </div>
            )}
          </StaggerContainer>
        </div>
      </section>

      {/* ── PARTNER CTA ── */}
      <section className="heavy-section-deferred" style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ padding: '0 20px', maxWidth: 1240 }}>
          <div
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-light)',
              borderTop: '1px solid var(--apple-glass-highlight)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 20px 48px -12px rgba(26, 35, 56, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
              padding: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 48,
              position: 'relative',
              overflow: 'hidden',
              margin: '0 auto',
            }}
          >
            {/* Background Ambient Gold Sheen */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '42%',
                background: 'radial-gradient(ellipse at 100% 50%, rgba(199,155,55,0.12), transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <FadeIn direction="up" style={{ flex: 1, position: 'relative', zIndex: 1 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
                  letterSpacing: '-0.028em',
                  lineHeight: 1.15,
                  color: 'var(--text-primary)',
                  marginBottom: 16,
                }}
              >
                Are you a University or Hostel Partner?
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.08rem',
                  lineHeight: 1.65,
                  marginBottom: 32,
                  maxWidth: 580,
                }}
              >
                Claim your institution&apos;s profile to receive pre-qualified KCSE student leads (with verified 48-point cluster scores and HEF bands), manage campus analytics, and track enrollment revenue.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <HoverScale>
                  <Link href="/portal" className="btn btn-gold" style={{ borderRadius: 'var(--radius-md)' }}>
                    Access Partner Portal (Live Demo)
                  </Link>
                </HoverScale>
                <HoverScale>
                  <Link href="/contact" className="btn btn-outline" style={{ borderRadius: 'var(--radius-md)' }}>
                    Partner Onboarding & Pricing
                  </Link>
                </HoverScale>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
