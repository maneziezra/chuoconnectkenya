import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Calculator, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { GRADE_GUIDES, getCoursesForGradeGuide } from '@/lib/data/gradeGuides';

export const metadata: Metadata = {
  title: 'KCSE Mean Grade Course & Career Guides (A to D+)',
  description:
    'Find the best KUCCPS degree, KMTC, and TVET diploma courses in Kenya for your exact KCSE Mean Grade · from A & A- to B+, B, C+, C plain, C- and D+.',
};

export default function GradesIndexPage() {
  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero Banner */}
      <div style={{ padding: '40px 20px 0' }}>
        <div
          style={{
            position: 'relative',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 48px -12px rgba(26, 35, 56, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
            background: 'var(--bg-primary)',
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
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                marginBottom: 16,
                backdropFilter: 'blur(16px)',
              }}
            >
              <Sparkles size={13} style={{ color: 'var(--gold-primary)' }} />
              2026 KUCCPS & TVET Placement Guides
            </span>
            <h1
              style={{
                color: 'var(--text-primary)',
                marginBottom: 12,
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
              }}
            >
              Courses by KCSE Mean Grade (A to D+)
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 680, lineHeight: 1.6, marginBottom: 24 }}>
              Select your KCSE Mean Grade below to explore qualifying Bachelor’s degrees, KMTC medical diplomas, and accredited TVET-to-Degree pathways, complete with 2026 cutoffs and HEF Band 1–5 funding rules.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/calculator" className="btn btn-gold" style={{ borderRadius: 'var(--radius-md)' }}>
                <Calculator size={16} /> Calculate Exact Cluster Points
              </Link>
              <Link href="/courses" className="btn btn-outline" style={{ borderRadius: 'var(--radius-md)' }}>
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
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-light)',
                    borderTop: '1px solid var(--apple-glass-highlight)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform var(--apple-press), box-shadow var(--apple-ease)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--accent-gold)',
                          color: 'var(--gold-contrast-text)',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: 800,
                          fontSize: '1.05rem',
                        }}
                      >
                        Grade {guide.gradeLabel}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          background: guide.isDegreeEligible ? 'rgba(16, 185, 129, 0.14)' : 'var(--gold-glow)',
                          color: guide.isDegreeEligible ? 'var(--success-text)' : 'var(--text-primary)',
                          border: '1px solid var(--border-light)',
                        }}
                      >
                        {guide.isDegreeEligible ? 'Direct Degree Entry' : 'Diploma & TVET Bridge'}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)',
                        marginBottom: 8,
                        lineHeight: 1.35,
                      }}
                    >
                      {guide.headline}
                    </h2>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                      {guide.summary}
                    </p>

                    <div
                      style={{
                        padding: 12,
                        borderRadius: 'var(--radius-md)',
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
                        <strong className="tabular-nums" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                          {guide.aggregateRange}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Cluster / Entry Tier:</span>
                        <strong className="tabular-nums" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
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
              padding: '36px 32px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              borderTop: '1px solid var(--apple-glass-highlight)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <div style={{ maxWidth: 620 }}>
              <div style={{ color: 'var(--gold-primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Official KUCCPS Formula + HEF Means-Testing Simulator
              </div>
              <h3
                style={{
                  fontSize: '1.35rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                Don’t Guess Your Cluster Points · Calculate All 8 Clusters Instantly
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
                Two students with the same Mean Grade can have a 6-point difference in weighted cluster scores depending on their 4 cluster subjects. Enter your 7–12 KCSE subjects to see your exact placement odds.
              </p>
            </div>
            <Link href="/calculator" className="btn btn-gold" style={{ borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={16} /> Launch KUCCPS Calculator
            </Link>
          </div>
        </div>
      </section>
    </div>

  );
}
