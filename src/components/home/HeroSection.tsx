'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, MapPin, CheckCircle } from 'lucide-react';
import { universitiesData } from '@/lib/data/universities';
import { GRADE_GUIDES, getCoursesForGradeGuide } from '@/lib/data/gradeGuides';

const COUNTIES_QUICK = ['All', 'Nairobi', 'Kiambu', 'Nakuru', 'Uasin Gishu', 'Mombasa', 'Kisumu', 'Nyeri'];

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
      <div className="container" style={{ paddingTop: 'clamp(28px, 4vw, 52px)', paddingBottom: 'clamp(56px, 7vw, 96px)' }}>
        {/* 1. Standfirst on Left Margin + Monumental Display Title on 42% Vertical Axis */}
        <div className="editorial-axis-row" style={{ marginBottom: 'clamp(32px, 4.5vw, 52px)' }}>
          {/* Left Column (0% -> 42%): Standfirst + Primary Actions */}
          <div style={{ paddingRight: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24 }}>
            <p
              style={{
                fontSize: '1.25rem',
                lineHeight: 1.45,
                color: 'var(--text-primary)',
                fontWeight: 500,
                maxWidth: '32ch',
                letterSpacing: '-0.015em',
                margin: 0,
              }}
            >
              Calculate your exact 48-point KUCCPS cluster weight, estimate HEF household bands, and compare all 68 accredited Kenyan universities and national polytechnics.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/calculator" className="btn btn-gold">
                <Calculator size={16} /> Calculate Cluster Points
              </Link>
              <Link href="/universities" className="btn btn-outline">
                Explore 68 Campuses <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Right Column (42% Axis -> 100%): Monumental 2-Line Display Title */}
          <div className="editorial-hero-title-col">
            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.05em',
                lineHeight: 0.94,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Every Kenyan
              <br />
              <span style={{ color: 'var(--accent-gold)' }}>Campus Indexed.</span>
            </h1>
          </div>
        </div>

        {/* 2. Gutterless 6x2 Mosaic Masthead */}
        <div className="editorial-mosaic" style={{ marginBottom: 'clamp(64px, 8vw, 104px)' }}>
          {/* Tile 1: UoN Photo */}
          <Link href="/universities/uon" style={{ position: 'relative', overflow: 'hidden', display: 'block' }}>
            <img
              src="/images/universities/uon.jpg"
              alt="University of Nairobi Main Campus"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(18, 20, 23, 0.38)', display: 'flex', alignItems: 'flex-end', padding: '16px 20px' }}>
              <span style={{ color: '#F4F5F7', fontSize: '0.875rem', fontWeight: 700 }}>UoN Nairobi</span>
            </div>
          </Link>

          {/* Tile 2: Tonal Figure Block */}
          <div style={{ background: 'var(--brand-navy)', color: '#F4F5F7', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--gold-primary)' }}>
              68 Campuses
            </div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(244, 245, 247, 0.78)' }}>
              CUE &amp; TVETA Registry
            </div>
          </div>

          {/* Tile 3: Strathmore Photo */}
          <Link href="/universities/strath" style={{ position: 'relative', overflow: 'hidden', display: 'block' }}>
            <img
              src="/images/universities/strath.jpg"
              alt="Strathmore University Madaraka Campus"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(18, 20, 23, 0.35)', display: 'flex', alignItems: 'flex-end', padding: '16px 20px' }}>
              <span style={{ color: '#F4F5F7', fontSize: '0.875rem', fontWeight: 700 }}>Strathmore</span>
            </div>
          </Link>

          {/* Tile 4: Tonal Stone Tile */}
          <div style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              48.0 Max
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              KUCCPS Cluster Scale
            </div>
          </div>

          {/* Tile 5: JKUAT Photo */}
          <Link href="/universities/jkuat" style={{ position: 'relative', overflow: 'hidden', display: 'block' }}>
            <img
              src="/images/universities/jkuat.jpg"
              alt="JKUAT Juja Main Campus"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(18, 20, 23, 0.38)', display: 'flex', alignItems: 'flex-end', padding: '16px 20px' }}>
              <span style={{ color: '#F4F5F7', fontSize: '0.875rem', fontWeight: 700 }}>JKUAT Juja</span>
            </div>
          </Link>

          {/* Tile 6: Accent Gold Tile */}
          <Link href="/calculator" style={{ background: 'var(--accent-gold)', color: '#141619', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Cluster Engine
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Open <ArrowRight size={14} />
            </div>
          </Link>

          {/* Tile 7: Tonal Tertiary Tile */}
          <div style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              47 Counties
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              National Footprint
            </div>
          </div>

          {/* Tile 8: Kenyatta University Photo */}
          <Link href="/universities/ku" style={{ position: 'relative', overflow: 'hidden', display: 'block' }}>
            <img
              src="/images/universities/ku.jpg"
              alt="Kenyatta University Main Campus"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(18, 20, 23, 0.38)', display: 'flex', alignItems: 'flex-end', padding: '16px 20px' }}>
              <span style={{ color: '#F4F5F7', fontSize: '0.875rem', fontWeight: 700 }}>KU Kahawa</span>
            </div>
          </Link>

          {/* Tile 9: HEF Funding Tile */}
          <Link href="/scholarships" style={{ background: '#1F2636', color: '#F4F5F7', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none' }}>
            <div className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--gold-primary)' }}>
              Band 1–5
            </div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(244, 245, 247, 0.78)' }}>
              HEF Means Estimator
            </div>
          </Link>

          {/* Tile 10: Egerton University Photo */}
          <Link href="/universities/egerton" style={{ position: 'relative', overflow: 'hidden', display: 'block' }}>
            <img
              src="/images/universities/egerton.jpg"
              alt="Egerton University Njoro Campus"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(18, 20, 23, 0.38)', display: 'flex', alignItems: 'flex-end', padding: '16px 20px' }}>
              <span style={{ color: '#F4F5F7', fontSize: '0.875rem', fontWeight: 700 }}>Egerton</span>
            </div>
          </Link>

          {/* Tile 11: Tonal Secondary Tile */}
          <Link href="/housing" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Hostel Index
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Verified Campus Rent
            </div>
          </Link>

          {/* Tile 12: Moi University Photo */}
          <Link href="/universities/moi" style={{ position: 'relative', overflow: 'hidden', display: 'block' }}>
            <img
              src="/images/universities/moi.jpg"
              alt="Moi University Eldoret Campus"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(18, 20, 23, 0.38)', display: 'flex', alignItems: 'flex-end', padding: '16px 20px' }}>
              <span style={{ color: '#F4F5F7', fontSize: '0.875rem', fontWeight: 700 }}>Moi Eldoret</span>
            </div>
          </Link>
        </div>

        {/* 3. THE LIVE THING: Interactive KCSE Mean Grade & County Placement Ledger */}
        <div className="editorial-axis-row">
          {/* Left 42% Heading + Interactive Controls */}
          <div style={{ paddingRight: 28 }}>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.625rem, 3.05vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.04,
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

          {/* Right 58% Live Output Sheet */}
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

            {/* Recommended Programmes for Selected Grade (Full-width ledger rows, not boxed card grid) */}
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
