import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Star, Award, ArrowRight,
  Home, Calendar, Scale, MapPin
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { University } from '@/lib/types';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import { StaggerItem } from '@/components/animations/StaggerItem';
import { HoverScale } from '@/components/animations/HoverScale';
import HeroSection from '@/components/home/HeroSection';

export const metadata: Metadata = {
  title: 'Chuo Connect Kenya — Discover Your University',
  description:
    'Find and compare every university in Kenya. Calculate your KUCCPS score, read real student reviews, and get personalised recommendations — all in one place.'};

const FEATURES = [
  {
    icon: <Search size={22} aria-hidden="true" />,
    title: 'Deep Campus Profiles',
    desc: 'Accommodation, labs, clubs, sports, fees, virtual tours, and interactive campus maps — all in one profile.',
    href: '/universities'
  },
  {
    icon: <Scale size={22} aria-hidden="true" />,
    title: 'Side-by-Side Comparison',
    desc: 'Evaluate institutions side-by-side across tuition fees, programmes, facilities, ratings, and student life.',
    href: '/compare'
  },
  {
    icon: <Star size={22} aria-hidden="true" />,
    title: 'Dual Review Engine',
    desc: 'Separate, verified ratings from current students and parents across 9 distinct criteria for honest insights.',
    href: '/universities'
  },
  {
    icon: <Award size={22} aria-hidden="true" />,
    title: 'Funding & Scholarships',
    desc: 'Discover government bursaries, private scholarships, and international funding to support your education.',
    href: '/scholarships'
  },
  {
    icon: <Home size={22} aria-hidden="true" />,
    title: 'Student Housing',
    desc: 'Find affordable accommodation and hostels near campuses. Compare rooms, amenities, and prices easily.',
    href: '/housing'
  },
  {
    icon: <Calendar size={22} aria-hidden="true" />,
    title: 'Campus Events',
    desc: 'Discover upcoming campus events, open days, career fairs, and student activities across Kenya.',
    href: '/events'
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.from('universities').select('*').order('ranking', { ascending: true }).limit(3);
  const featuredUnis = (data || []).map((u: any) => ({
    ...u,
    image: u.coverUrl || u.logoUrl || u.image || '/images/universities/uon.jpg'
  })) as University[];

  return (
    <>
      {/* ── HERO SECTION ── */}
      <HeroSection />

      {/* ── FEATURES SECTION ── */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div style={{ padding: '0 20px' }}>
          <div
            style={{
              border: '2px solid var(--border-medium)',
              borderRadius: 20,
              boxShadow: 'var(--shadow-neo)',
              background: 'var(--bg-secondary)',
              padding: '64px 20px',
              maxWidth: 1200,
              margin: '0 auto'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <h2 className="text-h2" style={{ marginBottom: 16 }}>
                Everything you need to make the right choice
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
                We bring together all the data, insights, and community tools required to navigate Kenya&apos;s higher education landscape with confidence.
              </p>
            </div>

            <StaggerContainer
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: 24,
                maxWidth: 1000,
                margin: '0 auto'
              }}
            >
              {FEATURES.map((feat, i) => (
                <StaggerItem key={i}>
                  <HoverScale scale={1.03} className="h-full">
                    <Link
                      href={feat.href}
                      className="card"
                      style={{
                        display: 'block',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        height: '100%',
                        padding: 24
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          border: '2px solid var(--border-medium)',
                          borderRadius: 10,
                          background: 'var(--gold-glow)',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 20
                        }}
                      >
                        {feat.icon}
                      </div>
                      <h3
                        style={{
                          fontFamily: 'Playfair Display, serif',
                          fontSize: '1.25rem',
                          color: 'var(--text-primary)',
                          marginBottom: 12}}
                      >
                        {feat.title}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
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
      <section className="section" style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
            opacity: 0.04,
            pointerEvents: 'none'
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <FadeIn direction="up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
              <div>
                <h2 className="text-h2" style={{ marginBottom: 12 }}>Top Rated Campuses</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Based on thousands of verified student and parent reviews.</p>
              </div>
              <HoverScale>
                <Link href="/universities" className="btn btn-outline" style={{ display: 'flex', gap: 8 }}>
                  View All <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </HoverScale>
            </div>
          </FadeIn>

          <StaggerContainer
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 32}}
          >
            {featuredUnis.length > 0 ? featuredUnis.map(uni => (
              <StaggerItem key={uni.id}>
                <HoverScale scale={1.02} className="h-full">
                  <Link
                    href={`/universities/${uni.id}`}
                    className="card"
                    style={{ overflow: 'hidden', textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}
                  >
                    <div style={{ height: 200, position: 'relative' }}>
                      <img
                        src={uni.image}
                        alt={uni.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          background: 'var(--bg-primary)',
                          padding: '4px 10px',
                          border: '2px solid var(--border-medium)',
                          borderRadius: 8,
                          boxShadow: 'var(--shadow-neo)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)'
                        }}
                      >
                        <Star size={14} aria-hidden="true" style={{ color: 'var(--gold-primary)', fill: 'var(--gold-primary)' }} />
                        {uni.rating?.toFixed(1) || 'N/A'}
                      </div>
                    </div>
                    <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span
                          className={`badge ${uni.type === 'Public' ? 'badge-navy' : 'badge-gold'}`}
                          style={{
                            border: '2px solid var(--border-medium)',
                            borderRadius: 8,
                            boxShadow: 'var(--shadow-neo)'
                          }}
                        >
                          {uni.type}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                          Est. {uni.established}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontFamily: 'Playfair Display, serif',
                          fontSize: '1.25rem',
                          color: 'var(--text-primary)',
                          marginBottom: 8,
                          lineHeight: 1.4}}
                      >
                        {uni.name}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20, flex: 1 }}>
                        {uni.overview?.substring(0, 100)}...
                      </p>
                      
                      <div style={{ paddingTop: 16, borderTop: '2px solid var(--navy-deep)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={14} aria-hidden="true" /> {uni.county}
                        </span>
                        <span style={{ color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
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
                  border: '2px solid var(--border-medium)',
                  borderRadius: 20,
                  boxShadow: 'var(--shadow-neo)'
                }}
              >
                <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Populate Supabase with mock universities to see them here.</p>
              </div>
            )}
          </StaggerContainer>
        </div>
      </section>

      {/* ── PARTNER CTA ── */}
      <section style={{ padding: '80px 0', borderTop: '2px solid var(--navy-deep)' }}>
        <div className="container" style={{ padding: '0 20px', maxWidth: 1240 }}>
          <div
            style={{
              background: 'var(--bg-tertiary)',
              border: '2px solid var(--border-light)',
              borderRadius: 20,
              boxShadow: '6px 6px 0px var(--border-medium)',
              padding: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 48,
              position: 'relative',
              overflow: 'hidden',
              margin: '0 auto'
            }}
          >
            {/* Background Accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '40%',
                background: 'linear-gradient(90deg, transparent, rgba(199,155,55,0.1))'}}
            />

            <FadeIn direction="up" style={{ flex: 1, position: 'relative', zIndex: 1 }}>
              <h2
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '2.5rem',
                  color: 'var(--text-primary)',
                  marginBottom: 16}}
              >
                Are you a University Admin?
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  marginBottom: 32,
                  maxWidth: 500}}
              >
                Claim your institution's profile to access detailed analytics, manage your campus information, update courses, and connect with prospective students.
              </p>
              <div style={{ display: 'flex', gap: 16 }}>
                <HoverScale>
                  <Link href="/portal" className="btn btn-gold">
                    Access Partner Portal
                  </Link>
                </HoverScale>
              </div>
            </FadeIn>

            <div style={{ display: 'none' }} className="partner-cta-img">
              {/* Optional: Add a dashboard mockup image here later */}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .partner-cta-img { display: none !important; }
          }
        `}</style>
      </section>
    </>
  );
}
