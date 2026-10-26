import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Compass, BookOpen, GraduationCap, 
  ArrowRight, Clock, Target, Rocket, AlertCircle, CheckCircle2,
  Search, Users, Star, Image as ImageIcon
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admissions Guidance & Student Hub',
  description: 'Expert advice, KUCCPS placement guides, scholarship opportunities, and about the Chuo Connect Kenya platform.',
};

import { ARTICLES } from '@/lib/data/articles';

const CORE_FEATURES = [
  {
    icon: <Search size={24} />,
    title: 'Campus Discovery',
    desc: 'Browse institutions based on county, type, programs, fees, population, and facilities.'
  },
  {
    icon: <BookOpen size={24} />,
    title: 'Campus Profiles',
    desc: 'Detailed overviews of history, academic programs, requirements, tuition fees, and campus lifestyle.'
  },
  {
    icon: <Target size={24} />,
    title: 'Smart Search & Compare',
    desc: 'Search by course, county, or career field. Compare multiple institutions side-by-side objectively.'
  },
  {
    icon: <Star size={24} />,
    title: 'Student Reviews',
    desc: 'Verified students share authentic experiences regarding academic quality, accommodation, and campus environment.'
  },
  {
    icon: <ImageIcon size={24} />,
    title: 'Virtual Campus Gallery',
    desc: 'Explore professional photography, campus videos, 360° virtual tours, and drone footage.'
  },
  {
    icon: <Users size={24} />,
    title: 'Student Ambassadors',
    desc: 'Current students answer questions from prospective students about daily campus life and academics.'
  }
];

export default function GuidancePage() {
  return (
    <>
      {/* Hero Section */}
      <div style={{ padding: '40px 20px 0' }}>
        <div
          style={{
            position: 'relative',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-secondary)',
            padding: '44px 36px',
            overflow: 'hidden',
          }}
        >
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 14px',
                background: 'var(--apple-glass-bg)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 16,
                backdropFilter: 'blur(16px)',
              }}
            >
              <Compass size={13} style={{ color: 'var(--gold-primary)' }} />
              Admissions &amp; Guidance
            </span>
            <h1
              style={{
                color: 'var(--text-primary)',
                marginBottom: 12,
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
              }}
            >
              Guidance &amp; Admissions.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 680, lineHeight: 1.5 }}>
              Expert placement guidance, campus comparisons, and admissions resources.
            </p>
          </div>
        </div>
      </div>

      {/* Executive Summary / Platform Vision */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
            
            <div
              className="card"
              style={{
                padding: 32,
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'var(--gold-glow)', color: 'var(--text-primary)', marginBottom: 20 }}>
                <Rocket size={22} style={{ color: 'var(--gold-primary)' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12 }}>Our Vision</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.5, margin: 0 }}>
                Kenya&apos;s authoritative platform for university admissions, cutoffs, and campus discovery.
              </p>
            </div>

            <div
              className="card"
              style={{
                padding: 32,
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'var(--gold-glow)', color: 'var(--text-primary)', marginBottom: 20 }}>
                <Target size={22} style={{ color: 'var(--gold-primary)' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12 }}>Our Mission</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.5, margin: 0 }}>
                Accurate data, immersive campus profiles, and transparent funding calculations for every student.
              </p>
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'start', marginBottom: 64 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 8, background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', borderRadius: '50%' }}>
                  <AlertCircle size={22} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>The Challenge</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 16 }}>
                Existing platforms primarily focus on admission requirements or course listings, leaving students without insight into campus life, facilities, student experiences, accommodation, and overall suitability.
              </p>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, paddingLeft: 20 }}>
                <li>Limited information about campus life.</li>
                <li>Difficulty comparing universities side-by-side.</li>
                <li>Minimal exposure to campus facilities before applying.</li>
                <li>Uncertainty about accommodation, costs, and support.</li>
              </ul>
            </div>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 8, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-text)', borderRadius: '50%' }}>
                  <CheckCircle2 size={22} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Our Solution</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 16 }}>
                Chuo Connect Kenya serves as a centralized platform focusing on helping students answer one fundamental question: <strong style={{ color: 'var(--text-primary)' }}>“Which campus is the best fit for me?”</strong>
              </p>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, paddingLeft: 20 }}>
                <li>Discover universities and explore campus facilities.</li>
                <li>Watch virtual campus tours and authentic student experiences.</li>
                <li>Find verified accommodation and scholarship information.</li>
                <li>Receive personalized campus recommendations (AI Campus Match).</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 14 }}>Core Platform Features</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', fontSize: '0.98rem' }}>
              Everything you need to confidently choose the right campus for your academic and personal goals.
            </p>
          </div>
          
          <div className="grid-auto">
            {CORE_FEATURES.map((feat, i) => (
              <div
                key={i}
                className="card card-body"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 26,
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                }}
              >
                <div style={{ width: 44, height: 44, border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)', marginBottom: 18 }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 8 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Original Articles */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 6 }}>Student Success Guides</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Expert resources to navigate your academic journey.</p>
          </div>

          <div className="grid-auto">
            {ARTICLES.map((article, i) => (
              <div
                key={i}
                className="card card-body"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 26,
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                }}
              >
                <div style={{ width: 44, height: 44, border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)', marginBottom: 18 }}>
                  {article.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.3 }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
                  {article.desc}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={13} /> {article.readTime}
                  </span>
                  <Link href={`/guidance/article/${article.slug}`} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Read Article <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 64,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              borderTop: '1px solid var(--apple-glass-highlight)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-sm)',
              padding: '40px 36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 40,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                <GraduationCap size={18} /> Still not sure where to start?
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 12 }}>
                Let our engine guide you.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                Enter your KCSE grades into our KUCCPS Calculator. We&apos;ll automatically compute your cluster points and show you exactly which degree programmes you qualify for across all accredited Kenyan universities.
              </p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Link href="/dashboard" className="btn btn-gold btn-lg" style={{ borderRadius: 'var(--radius-md)' }}>
                Go to Calculator <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

