import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Compass, BookOpen, GraduationCap, 
  ArrowRight, Clock, Target, Rocket, AlertCircle, CheckCircle2,
  Search, Users, Star, Image as ImageIcon
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guidance & About | Chuo Connect Kenya',
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
        <div style={{ position: 'relative', border: '2px solid var(--navy-deep)', borderRadius: 20, boxShadow: '4px 4px 0px var(--navy-deep)', background: '#FAFAF8', padding: '48px 40px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px', opacity: 0.04, pointerEvents: 'none' }}></div>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', background: 'var(--gold-glow)', border: '2px solid var(--navy-deep)', borderRadius: 8, boxShadow: '2px 2px 0px var(--navy-deep)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--navy-deep)', marginBottom: 16 }}>
              <Compass size={14} />
              About & Guidance
            </span>
            <h1 className="text-h1" style={{ color: 'var(--navy-deep)', marginBottom: 12 }}>
              Connecting Students to Campuses Across Kenya
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 700, lineHeight: 1.6 }}>
              Choosing a university is one of life's most important decisions. We aim to be Kenya's premier Campus Discovery Platform, enabling students to explore, compare, and connect with higher education institutions.
            </p>
          </div>
        </div>
      </div>

      {/* Executive Summary / Platform Vision */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
            
            <div className="card hover-gold" style={{ padding: 32 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, border: '2px solid var(--navy-deep)', borderRadius: 10, background: 'var(--gold-glow)', color: 'var(--navy-deep)', marginBottom: 16 }}><Rocket size={24} /></div>
              <h3 className="text-h3" style={{ color: 'var(--navy-deep)', marginBottom: 12 }}>Our Vision</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                To become Kenya's most trusted digital platform for discovering, exploring, and connecting students with campuses and higher education opportunities.
              </p>
            </div>

            <div className="card hover-gold" style={{ padding: 32 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, border: '2px solid var(--navy-deep)', borderRadius: 10, background: 'var(--gold-glow)', color: 'var(--navy-deep)', marginBottom: 16 }}><Target size={24} /></div>
              <h3 className="text-h3" style={{ color: 'var(--navy-deep)', marginBottom: 12 }}>Our Mission</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                To simplify the university selection process by providing students with accurate information, immersive campus experiences, and personalized recommendations to help them make informed educational decisions.
              </p>
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'start', marginBottom: 64 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 8, background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', borderRadius: '50%' }}>
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-h3" style={{ color: 'var(--navy-deep)' }}>The Challenge</h3>
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
                <div style={{ padding: 8, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%' }}>
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-h3" style={{ color: 'var(--navy-deep)' }}>Our Solution</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 16 }}>
                Chuo Connect Kenya serves as a centralized platform focusing on helping students answer one fundamental question: <strong style={{ color: 'var(--navy-deep)' }}>“Which campus is the best fit for me?”</strong>
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
            <h2 className="text-h2" style={{ color: 'var(--navy-deep)', marginBottom: 16 }}>Core Platform Features</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
              Everything you need to confidently choose the right campus for your academic and personal goals.
            </p>
          </div>
          
          <div className="grid-auto">
            {CORE_FEATURES.map((feat, i) => (
              <div key={i} className="card card-body hover-gold" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 48, height: 48, border: '2px solid var(--navy-deep)', borderRadius: 10, background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-deep)', marginBottom: 20 }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy-deep)', marginBottom: 8 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
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
            <h2 className="text-h2" style={{ color: 'var(--navy-deep)' }}>Student Success Guides</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Expert resources to navigate your academic journey.</p>
          </div>

          <div className="grid-auto">
            {ARTICLES.map((article, i) => (
              <div key={i} className="card card-body hover-gold" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 48, height: 48, border: '2px solid var(--navy-deep)', borderRadius: 10, background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-deep)', marginBottom: 20 }}>
                  {article.icon}
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, color: 'var(--navy-deep)', marginBottom: 12, lineHeight: 1.3 }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24, flex: 1 }}>
                  {article.desc}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={12} /> {article.readTime}
                  </span>
                  <Link href={`/guidance/article/${article.slug}`} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Read Article <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 64, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--navy-deep)', fontWeight: 700, marginBottom: 12 }}>
                <GraduationCap size={20} /> Still not sure where to start?
              </div>
              <h2 className="text-h2" style={{ color: 'var(--navy-deep)', marginBottom: 16 }}>
                Let our engine guide you.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Enter your KCSE grades into our KUCCPS Calculator. We'll automatically compute your cluster points and show you exactly which degree programmes you qualify for across all accredited Kenyan universities.
              </p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Link href="/dashboard" className="btn btn-navy btn-lg">
                Go to Calculator <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
