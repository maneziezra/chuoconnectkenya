'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { universitiesData } from '@/lib/data/universities';
import { GRADE_GUIDES, getCoursesForGradeGuide } from '@/lib/data/gradeGuides';

const COUNTIES_QUICK = ['All', 'Nairobi', 'Kiambu', 'Nakuru', 'Uasin Gishu', 'Mombasa', 'Kisumu', 'Nyeri'];

const PARTNERS = [
  { id: 'uon', shortName: 'University of Nairobi', established: 1970, county: 'Nairobi' },
  { id: 'strath', shortName: 'Strathmore University', established: 1961, county: 'Madaraka' },
  { id: 'jkuat', shortName: 'JKUAT Juja', established: 1994, county: 'Kiambu' },
  { id: 'ku', shortName: 'Kenyatta University', established: 1985, county: 'Kahawa' },
  { id: 'usiu', shortName: 'USIU-Africa', established: 1969, county: 'Kasarani' },
  { id: 'egerton', shortName: 'Egerton University', established: 1987, county: 'Nakuru' },
  { id: 'moi', shortName: 'Moi University', established: 1984, county: 'Eldoret' },
  { id: 'tuk', shortName: 'Technical University of Kenya', established: 1961, county: 'Nairobi' },
];

export default function HeroSection() {
  const [selectedGradeSlug, setSelectedGradeSlug] = useState<string>('b-plus');
  const [selectedCounty, setSelectedCounty] = useState<string>('All');

  const activeGuide = useMemo(
    () => GRADE_GUIDES.find(g => g.slug === selectedGradeSlug) || GRADE_GUIDES[2],
    [selectedGradeSlug]
  );

  const sampleCourses = useMemo(() => {
    const { degreeCourses, diplomaCourses } = getCoursesForGradeGuide(activeGuide);
    return (activeGuide.isDegreeEligible ? degreeCourses : diplomaCourses).slice(0, 3);
  }, [activeGuide]);

  const matchingInstitutions = useMemo(() => {
    return universitiesData
      .filter(u => {
        if (selectedCounty !== 'All' && u.county.toLowerCase() !== selectedCounty.toLowerCase()) {
          return false;
        }
        if (activeGuide.isDegreeEligible) {
          return u.type === 'Public' || u.type === 'Private' || u.type === 'Technical';
        }
        return u.type === 'TVET' || u.type === 'Technical' || ['mku', 'kca', 'zetech', 'kabarak', 'tuk', 'tum', 'jkuat', 'ku'].includes(u.id);
      })
      .slice(0, 4);
  }, [activeGuide, selectedCounty]);

  return (
    <section style={{ background: 'var(--bg-primary)' }}>
      <div className="container" style={{ paddingTop: 'clamp(20px, 3.5vw, 44px)', paddingBottom: 'clamp(56px, 7vw, 96px)' }}>
        
        {/* 1. AMPEROS HERO CARD */}
        <article className="amperos-hero-card">
          {/* Media Backdrop (Authentic UoN Campus Architecture) */}
          <div className="amperos-hero-media">
            <img
              src="/images/universities/uon.jpg"
              alt="University of Nairobi Main Campus Plaza"
              className="amperos-hero-img"
            />
            <div className="amperos-hero-scrim" />
            
            {/* Provenance Tag */}
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                right: 28,
                zIndex: 4,
                display: 'none',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 4,
              }}
              className="md:flex"
            >
              <span
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: '#fcf7f4',
                  letterSpacing: '-0.01em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <ShieldCheck size={14} style={{ color: 'var(--brand-gold)' }} />
                University of Nairobi · Flagship Campus
              </span>
              <span className="tabular-nums" style={{ fontSize: '0.84rem', color: 'rgba(252, 247, 244, 0.76)' }}>
                Est. 1970 · Nairobi County · CUE Chartered
              </span>
            </div>
          </div>

          {/* Left Content Column */}
          <div className="amperos-hero-content">
            {/* Monumental Editorial Serif Headline */}
            <h1 className="amperos-hero-title">
              A New Standard for Admissions.
            </h1>

            {/* Standfirst / Mission */}
            <p className="amperos-hero-standfirst">
              Chuo Connect indexes official KUCCPS cluster cutoff weights, simulates household fees under HEF Bands 1 to 5, and verifies degree &amp; TVET bridge pathways across 68 accredited Kenyan institutions.
            </p>

            {/* Dual Amperos Action CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <Link href="/calculator" className="amperos-btn-primary">
                <Calculator size={16} />
                <span>Calculate Cluster Points</span>
              </Link>
              <Link href="/universities" className="amperos-btn-secondary">
                <span>Explore 68 Campuses</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* 2026 Cycle Announcement Pill */}
            <div style={{ marginTop: 6 }}>
              <Link href="/calculator" className="amperos-badge-pill">
                <span className="amperos-badge-tag">
                  2026/2027 Cycle
                </span>
                <span className="amperos-badge-text">
                  KUCCPS Cluster Scores &amp; HEF Band 1–5 Formula Updated
                </span>
                <ArrowRight size={14} style={{ color: '#fcf7f4', opacity: 0.85, flexShrink: 0 }} />
              </Link>
            </div>
          </div>
        </article>

        {/* 2. AMPEROS TRUST & PARTNER BAR */}
        <div data-ui="partners-trust-bar" style={{ marginTop: 28, marginBottom: 'clamp(48px, 6.5vw, 84px)', padding: '24px 0 8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 32,
              flexWrap: 'wrap',
            }}
          >
            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                maxWidth: '28ch',
                margin: 0,
                lineHeight: 1.45,
              }}
            >
              Indexed across Kenya&apos;s chartered universities and clinical institutions
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(14px, 2.5vw, 24px)',
                flexWrap: 'wrap',
              }}
            >
              {PARTNERS.map(p => (
                <Link
                  key={p.id}
                  href={`/universities/${p.id}`}
                  style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'baseline',
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {p.shortName}
                  </span>
                  <span className="tabular-nums" style={{ fontSize: '0.84rem', color: 'var(--text-tertiary)' }}>
                    ({p.county})
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 3. INTERACTIVE KCSE MEAN GRADE & COUNTY PLACEMENT LEDGER */}
        <div className="editorial-axis-row">
          {/* Left 42% Axis: Heading & Interactive Filters */}
          <div style={{ paddingRight: 28 }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.625rem, 3vw, 2.75rem)',
                fontWeight: 400,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                marginBottom: 14,
              }}
            >
              Select KCSE Mean Grade.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24, maxWidth: '38ch' }}>
              Choose your KCSE mean grade and county below to inspect eligible degree or TVET diploma placement pathways immediately.
            </p>

            <div data-ui="grade-selector-controls">
              {/* Grade Selector Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }} role="group" aria-label="KCSE Mean Grade">
                {GRADE_GUIDES.map(g => {
                  const active = g.slug === selectedGradeSlug;
                  return (
                    <button
                      key={g.slug}
                      type="button"
                      onClick={() => setSelectedGradeSlug(g.slug)}
                      style={{
                        padding: '10px 15px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        background: active ? 'var(--brand-navy)' : 'var(--bg-secondary)',
                        color: active ? '#F4F5F7' : 'var(--text-primary)',
                        transition: 'background-color 0.15s ease, color 0.15s ease, transform 0.08s ease',
                      }}
                    >
                      {g.gradeLabel}
                    </button>
                  );
                })}
              </div>

              {/* County Filter Pills */}
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Filter by County
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {COUNTIES_QUICK.map(c => {
                  const active = c === selectedCounty;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCounty(c)}
                      style={{
                        padding: '7px 13px',
                        borderRadius: 'var(--radius-full)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        background: active ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                        color: active ? '#141619' : 'var(--text-secondary)',
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 58% Axis: Live Output Ledger */}
          <div
            data-ui="live-placement-ledger"
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(20px, 3vw, 32px)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span className={`badge ${activeGuide.isDegreeEligible ? 'badge-green' : 'badge-gold'}`}>
                    {activeGuide.isDegreeEligible ? 'Direct Degree Entry (C+ and above)' : 'TVET & Diploma Bridge Pathway'}
                  </span>
                  <span className="badge badge-navy tabular-nums">{activeGuide.aggregateRange}</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
                  {activeGuide.headline}
                </div>
              </div>
              <Link href={`/grades/${activeGuide.slug}`} className="btn btn-outline btn-sm">
                Grade {activeGuide.gradeLabel} Guide <ArrowRight size={14} />
              </Link>
            </div>

            {/* Recommended Programmes for Selected Grade */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Top Eligible Programmes for Grade {activeGuide.gradeLabel}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sampleCourses.map(course => (
                  <div
                    key={course.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 8,
                      background: 'var(--bg-primary)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {course.title}
                    </span>
                    <span className="tabular-nums" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {course.level} · {course.level === 'Degree' ? `Cutoff ${course.minPoints.toFixed(1)} pts` : `Min Grade ${course.minMeanGrade || 'C-'}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Matching Campuses in Selected County */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Matching Accredited Institutions {selectedCounty !== 'All' ? `in ${selectedCounty}` : 'Across Kenya'}
                </span>
                <Link href={`/universities${selectedCounty !== 'All' ? `?county=${encodeURIComponent(selectedCounty)}` : ''}`} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                  View All 68 →
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
                {matchingInstitutions.map(uni => (
                  <Link
                    key={uni.id}
                    href={`/universities/${uni.id}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-sm)',
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {uni.abbrev} · {uni.name}
                      </div>
                      <div className="tabular-nums" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <MapPin size={12} /> {uni.county} · Rank #{uni.ranking}
                      </div>
                    </div>
                    <CheckCircle size={15} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginLeft: 8 }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
