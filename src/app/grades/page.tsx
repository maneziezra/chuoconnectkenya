import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Calculator, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { GRADE_GUIDES, getCoursesForGradeGuide } from '@/lib/data/gradeGuides';

export const metadata: Metadata = {
  title: 'KCSE Mean Grade Course & Career Guides (A to D+)',
  description:
    'Find the best KUCCPS degree, KMTC, and TVET diploma courses in Kenya for your exact KCSE Mean Grade — from A & A- to B+, B, C+, C plain, C- and D+.',
};

export default function GradesIndexPage() {
  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero Banner */}
      <div style={{ padding: '40px 20px 0' }}>
        <div
          style={{
            position: 'relative',
            border: '2px solid var(--border-medium)',
            borderRadius: 20,
            boxShadow: 'var(--shadow-neo)',
            background: 'var(--bg-primary)',
            padding: '48px 40px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
              backgroundSize: '28px 28px',
              opacity: 0.04,
              pointerEvents: 'none',
            }}
          />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 14px',
                background: 'var(--gold-glow)',
                border: '2px solid var(--border-medium)',
                borderRadius: 8,
                boxShadow: 'var(--shadow-neo)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                marginBottom: 16,
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--gold-primary)' }} />
              2026 KUCCPS & TVET Placement Guides
            </span>
            <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 12 }}>
              Courses by KCSE Mean Grade (A to D+)
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 680, lineHeight: 1.6, marginBottom: 24 }}>
              Select your KCSE Mean Grade below to explore qualifying Bachelor’s degrees, KMTC medical diplomas, and accredited TVET-to-Degree pathways, complete with 2026 cutoffs and HEF Band 1–5 funding rules.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/calculator" className="btn btn-gold">
                <Calculator size={16} /> Calculate Exact Cluster Points
              </Link>
              <Link href="/courses" className="btn btn-outline">
                Browse All Courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Tier Cards */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {GRADE_GUIDES.map(guide => {
              const { degreeCourses, diplomaCourses } = getCoursesForGradeGuide(guide);
              const totalMatched = guide.isDegreeEligible ? degreeCourses.length : diplomaCourses.length;

              return (
                <Link
                  key={guide.slug}
                  href={`/grades/${guide.slug}`}
                  className="card"
                  style={{
                    padding: 28,
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 18,
                    background: 'var(--bg-primary)',
                    border: '2px solid var(--border-medium)',
                    boxShadow: 'var(--shadow-neo)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span
                        style={{
                          padding: '6px 14px',
                          borderRadius: 10,
                          background: 'var(--navy-deep)',
                          color: 'var(--gold-primary)',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                        }}
                      >
                        Grade {guide.gradeLabel}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: guide.isDegreeEligible ? 'rgba(16, 185, 129, 0.14)' : 'var(--gold-glow)',
                          color: guide.isDegreeEligible ? 'var(--success-text)' : 'var(--text-primary)',
                        }}
                      >
                        {guide.isDegreeEligible ? 'Direct Degree Entry' : 'Diploma & TVET Bridge'}
                      </span>
                    </div>

                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.22rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.35 }}>
                      {guide.headline}
                    </h2>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                      {guide.summary}
                    </p>

                    <div
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>KCSE Aggregate:</span>
                        <strong style={{ color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                          {guide.aggregateRange}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Cluster / Entry Tier:</span>
                        <strong style={{ color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                          {guide.typicalClusterRange}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      paddingTop: 14,
                      borderTop: '1px solid var(--border-light)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                      <GraduationCap size={16} style={{ color: 'var(--gold-primary)' }} />
                      {totalMatched} curated programmes
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--gold-primary)' }}>
                      View Guide <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Calculator CTA */}
          <div
            style={{
              marginTop: 48,
              padding: 36,
              borderRadius: 20,
              background: 'var(--navy-deep)',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 20,
              boxShadow: 'var(--shadow-neo)',
            }}
          >
            <div style={{ maxWidth: 620 }}>
              <div style={{ color: 'var(--gold-primary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Official KUCCPS Formula + HEF Means-Testing Simulator
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>
                Don’t Guess Your Cluster Points—Calculate All 8 Clusters Instantly
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
                Two students with the same Mean Grade can have a 6-point difference in weighted cluster scores depending on their 4 cluster subjects. Enter your 7–12 KCSE subjects to see your exact placement odds.
              </p>
            </div>
            <Link href="/calculator" className="btn btn-gold">
              <CheckCircle2 size={16} /> Launch KUCCPS Calculator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
