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

const CAMPUS_PREVIEWS = [
  {
    id: 'uon',
    label: 'UoN Nairobi',
    name: 'University of Nairobi',
    tag: 'Flagship Public Charter',
    est: 'Est. 1970 · Nairobi County · CUE Chartered',
    image: '/images/universities/uon.jpg',
  },
  {
    id: 'strath',
    label: 'Strathmore',
    name: 'Strathmore University',
    tag: 'Flagship Private Charter',
    est: 'Est. 1961 · Madaraka · CUE Chartered',
    image: '/images/universities/strath.jpg',
  },
  {
    id: 'jkuat',
    label: 'JKUAT Juja',
    name: 'JKUAT Juja',
    tag: 'Technology & Engineering Charter',
    est: 'Est. 1994 · Kiambu County · CUE Chartered',
    image: '/images/universities/jkuat.jpg',
  },
];

export default function HeroSection() {
  const [activeCampusIndex, setActiveCampusIndex] = useState<number>(0);
  const [selectedGradeSlug, setSelectedGradeSlug] = useState<string>('b-plus');
  const [selectedCounty, setSelectedCounty] = useState<string>('All');

  const activeCampus = CAMPUS_PREVIEWS[activeCampusIndex];

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
          {/* Media Backdrop (Authentic Kenyan Campus Architecture) */}
          <div className="amperos-hero-media">
            <img
              src={activeCampus.image}
              alt={`${activeCampus.name} campus architecture`}
              className="amperos-hero-img"
            />
            <div className="amperos-hero-scrim" />
            
            {/* Interactive Architectural Provenance Plaque & Campus Switcher */}
            <div
              style={{
                position: 'absolute',
                bottom: 28,
                right: 28,
                zIndex: 4,
                display: 'none',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 10,
              }}
              className="md:flex"
            >
              {/* Campus Selector Pills */}
              <div style={{ display: 'flex', gap: 6, background: 'rgba(35, 18, 11, 0.65)', padding: 4, borderRadius: 'var(--radius-full)' }}>
                {CAMPUS_PREVIEWS.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCampusIndex(i)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      background: activeCampusIndex === i ? '#fff5f0' : 'transparent',
                      color: activeCampusIndex === i ? '#23120b' : 'rgba(252, 247, 244, 0.75)',
                      transition: 'background-color 0.16s ease, color 0.16s ease',
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Provenance Badge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
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
                  {activeCampus.name} · {activeCampus.tag}
                </span>
                <span className="tabular-nums" style={{ fontSize: '0.84rem', color: 'rgba(252, 247, 244, 0.76)' }}>
                  {activeCampus.est}
                </span>
              </div>
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
            <div style={{ marginTop: 4 }}>
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

        {/* DEDICATED ARCHITECTURAL BENCHMARK STRIP */}
        <div
          data-ui="hero-benchmark-strip"
          style={{
            marginTop: 24,
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(28px, 4vw, 44px) clamp(24px, 4vw, 48px)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'clamp(24px, 4vw, 48px)',
              alignItems: 'start',
            }}
          >
            <div>
              <div className="tabular-nums" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.1rem, 3.2vw, 2.75rem)', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1 }}>
                48.0
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 8, letterSpacing: '-0.015em' }}>
                KUCCPS Cluster Scale
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
                Four-subject normalized weighted formula evaluated across 20 degree clusters.
              </div>
            </div>

            <div>
              <div className="tabular-nums" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.1rem, 3.2vw, 2.75rem)', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1 }}>
                68
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 8, letterSpacing: '-0.015em' }}>
                Chartered Campuses
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
                Public universities, private charters, and national TVET polytechnics in all 47 counties.
              </div>
            </div>

            <div>
              <div className="tabular-nums" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.1rem, 3.2vw, 2.75rem)', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1 }}>
                5 Bands
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 8, letterSpacing: '-0.015em' }}>
                HEF Means Testing
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
                Government scholarships up to 80% with transparent household out-of-pocket tuition.
              </div>
            </div>
          </div>
        </div>

        {/* 2. AMPEROS TRUST & PARTNER BAR */}
        <div data-ui="partners-trust-bar" style={{ marginTop: 'clamp(44px, 5.5vw, 68px)', marginBottom: 'clamp(56px, 7vw, 92px)', padding: '24px 0' }}>
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
        <div className="editorial-axis-row" style={{ gap: 'clamp(32px, 5vw, 64px)' }}>
          {/* Left 42% Axis: Heading & Interactive Filters */}
          <div style={{ paddingRight: 16 }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.75rem, 3vw, 2.85rem)',
                fontWeight: 400,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                marginBottom: 16,
              }}
            >
              Select KCSE Mean Grade.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 28, maxWidth: '38ch' }}>
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
                        fontFamily: 'var(--font-serif)',
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
              padding: 'clamp(28px, 4vw, 40px)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
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
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>
                Top Eligible Programmes for Grade {activeGuide.gradeLabel}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                      padding: '12px 18px',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Matching Accredited Institutions {selectedCounty !== 'All' ? `in ${selectedCounty}` : 'Across Kenya'}
                </span>
                <Link href={`/universities${selectedCounty !== 'All' ? `?county=${encodeURIComponent(selectedCounty)}` : ''}`} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                  View All 68 →
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 10 }}>
                {matchingInstitutions.map(uni => (
                  <Link
                    key={uni.id}
                    href={`/universities/${uni.id}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 18px',
                      background: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-sm)',
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {uni.abbrev} · {uni.name}
                      </div>
                      <div className="tabular-nums" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
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
