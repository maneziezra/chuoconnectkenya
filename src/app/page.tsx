import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';

export const metadata: Metadata = {
  title: {
    absolute: 'Chuo Connect Kenya · The National University, KUCCPS & TVET Annual',
  },
  description:
    'Find and compare every accredited university and national polytechnic in Kenya. Calculate your KUCCPS 2026 cluster points, check HEF Band 1–5 fees, and explore KCSE grade pathways.',
};

const SHOWCASE_PANELS = [
  {
    id: 'uon',
    name: 'University of Nairobi',
    location: 'Rank #1 Public Charter · Nairobi County · Est. 1970',
    image: '/images/universities/uon.jpg',
    grow: 5,
  },
  {
    id: 'strath',
    name: 'Strathmore University',
    location: 'Rank #1 Private Charter · Madaraka · Est. 1961',
    image: '/images/universities/strath.jpg',
    grow: 2,
  },
  {
    id: 'jkuat',
    name: 'JKUAT Juja',
    location: 'Engineering & Technology · Kiambu · Est. 1994',
    image: '/images/universities/jkuat.jpg',
    grow: 3,
  },
  {
    id: 'kmtc',
    name: 'KMTC Campuses',
    location: 'Clinical & Health Sciences · 74 Campuses · Est. 1927',
    image: '/images/universities/kmtc.jpg',
    grow: 2,
  },
];

const FEATURE_ROWS = [
  {
    title: '48-Point Cluster Engine',
    summary:
      'Every degree programme in Kenya uses the official four-subject weighted formula alongside your 84-point KCSE aggregate. Our calculator runs all 20 subject clusters simultaneously and flags where your subject combination qualifies.',
    image: '/images/universities/ku.jpg',
    caption: 'Kenyatta University Main Campus · Kahawa, Nairobi',
    href: '/calculator',
    cta: 'Open Cluster Calculator',
    specs: ['All 20 KUCCPS Subject Clusters', 'C+ Degree & C-/D+ TVET Bridging', '2026 Cut-Off Comparison'],
  },
  {
    title: 'HEF Household Estimator',
    summary:
      'Under the Higher Education Funding (HEF) model, government scholarships and HELB loans are allocated across five household bands. Estimate your exact out-of-pocket household contribution before submitting your revision choices.',
    image: '/images/universities/moi.jpg',
    caption: 'Moi University Main Campus · Kesses, Uasin Gishu',
    href: '/scholarships',
    cta: 'Inspect HEF Bands & Bursaries',
    specs: ['Bands 1 to 5 Means Testing', 'Government Scholarship % Split', 'Equity, Elimu & Mastercard Grants'],
  },
  {
    title: 'Verified Campus Hostels',
    summary:
      'Tuition is only half the budget. Compare vetted private student residences (Qwetu, Qejani, and gated hostel courts) alongside on-campus accommodation rates, Wi-Fi reliability, and walking distance to lecture halls.',
    image: '/images/universities/egerton.jpg',
    caption: 'Egerton University Main Campus · Njoro, Nakuru',
    href: '/housing',
    cta: 'Browse Verified Student Hostels',
    specs: ['Monthly Rent Ledger by Campus', 'Walking Distance & Security Audits', 'Direct Caretaker Inquiry'],
  },
];

const DECIMAL_STATS = [
  { figure: '68.0', unit: 'Institutions', label: 'Chartered public & private universities, technical universities, and national polytechnics indexed across the republic.' },
  { figure: '47.0', unit: 'Counties', label: 'Complete geographic coverage from Nairobi and Mombasa to Garissa, Turkana, and Kilifi.' },
  { figure: '44.5', unit: 'Cluster Points', label: 'Typical top-tier cutoff for Bachelor of Medicine & Bachelor of Surgery (MBChB) at flagship campuses.' },
  { figure: '80.0', unit: 'Percent Grant', label: 'Maximum HEF government scholarship allocation for Band 1 households at public universities.' },
];

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* 1. HERO: 42% Vertical Axis Title + Mosaic Masthead + Live Placement Ledger */}
      <HeroSection />

      {/* 2. SHOWCASE: Band of Unequal Panels (flex-grow: 5, 2, 3, 2) */}
      <section style={{ paddingTop: 24 }}>
        <div className="container" style={{ marginBottom: 32 }}>
          <div className="editorial-axis-row">
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '34ch', margin: 0 }}>
              Verified Commons photography of flagship Kenyan public charters, private universities, and clinical training campuses.
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.625rem, 3.05vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.04,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Flagship Kenyan Campuses.
            </h2>
          </div>
        </div>

        <div className="container">
          <div className="editorial-showcase-band" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {SHOWCASE_PANELS.map(panel => (
              <Link
                key={panel.id}
                href={`/universities/${panel.id}`}
                className="editorial-showcase-panel"
                style={{ flexGrow: panel.grow, textDecoration: 'none' }}
              >
                <img
                  src={panel.image}
                  alt={panel.name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(18, 20, 23, 0.56)',
                  }}
                />
                <div style={{ position: 'relative', zIndex: 2, color: '#F4F5F7' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(1.375rem, 1.9vw, 1.75rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.08,
                      color: '#F4F5F7',
                      marginBottom: 8,
                    }}
                  >
                    {panel.name}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(244, 245, 247, 0.86)', fontWeight: 500 }}>
                    {panel.location}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES: Pinned Heading, Passing Rows on Full-Bleed Flat Field */}
      <section
        style={{
          background: 'var(--brand-navy)',
          color: '#F4F5F7',
          padding: 'clamp(64px, 8vw, 108px) 0',
          marginTop: 'clamp(56px, 7vw, 96px)',
        }}
      >
        <div className="container">
          <div className="editorial-axis-row">
            {/* Left Pinned Heading Column (0% -> 42%) */}
            <div className="editorial-pinned-col">
              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.625rem, 3.05vw, 2.75rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.04,
                  color: '#F4F5F7',
                  marginBottom: 20,
                }}
              >
                KUCCPS &amp; HEF Architecture.
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'rgba(244, 245, 247, 0.78)', maxWidth: '34ch', marginBottom: 28 }}>
                Every figure on ChuoConnect is anchored to Commission for University Education (CUE) charters, TVETA registries, and official KUCCPS cluster formulas.
              </p>
              <Link href="/compare?ids=uon,strath,jkuat" className="btn btn-gold">
                Compare Flagship Campuses <ArrowRight size={15} />
              </Link>
            </div>

            {/* Right Passing Rows Column (42% -> 100%) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {FEATURE_ROWS.map(row => (
                <div
                  key={row.title}
                  className="editorial-feature-row"
                >
                  <div style={{ minHeight: 220, position: 'relative' }}>
                    <img
                      src={row.image}
                      alt={row.caption}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div style={{ padding: 'clamp(22px, 3vw, 30px)' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(1.375rem, 1.9vw, 1.75rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        lineHeight: 1.12,
                        color: '#F4F5F7',
                        marginBottom: 10,
                      }}
                    >
                      {row.title}
                    </h3>
                    <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'rgba(244, 245, 247, 0.8)', marginBottom: 16, maxWidth: '58ch' }}>
                      {row.summary}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
                      {row.specs.map(s => (
                        <span
                          key={s}
                          style={{
                            padding: '5px 11px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(244, 245, 247, 0.08)',
                            color: '#F4F5F7',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <Link href={row.href} className="btn btn-gold btn-sm">
                      {row.cta} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS: Many-into-One Vector Diagram */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="editorial-axis-row" style={{ marginBottom: 48 }}>
            <div style={{ paddingRight: 28 }}>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '34ch', margin: 0 }}>
                Four student inputs converge into a single verified admission, tuition band, and hostel recommendation.
              </p>
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.625rem, 3.05vw, 2.75rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.04,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                KCSE Slip to Admission.
              </h2>
            </div>
          </div>

          <div
            data-ui="placement-pipeline-diagram"
            style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(20px, 4vw, 44px)',
            }}
          >
            <svg
              viewBox="0 0 1080 300"
              width="100%"
              role="img"
              aria-label="Diagram showing KCSE Mean Grade, 4 Cluster Subjects, HEF Household Band, and County Preference converging into the ChuoConnect Placement Engine and outputting Accredited Admission"
              style={{ display: 'block', width: '100%', height: 'auto' }}
            >
              {/* Connecting Cubic Bezier Paths */}
              <path d="M 240 45 C 370 45, 390 150, 490 150" fill="none" stroke="#C79B37" strokeWidth="2.5" />
              <path d="M 240 115 C 370 115, 390 150, 490 150" fill="none" stroke="#C79B37" strokeWidth="2.5" />
              <path d="M 240 185 C 370 185, 390 150, 490 150" fill="none" stroke="#C79B37" strokeWidth="2.5" />
              <path d="M 240 255 C 370 255, 390 150, 490 150" fill="none" stroke="#C79B37" strokeWidth="2.5" />
              <path d="M 730 150 L 830 150" fill="none" stroke="#161B26" strokeWidth="3" />

              {/* Left 4 Input Nodes */}
              <g transform="translate(20, 20)">
                <rect width="220" height="50" rx="8" fill="#EAECEF" />
                <text x="18" y="30" fill="#141619" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontSize="14" fontWeight="700">
                  KCSE Mean Grade (A to D+)
                </text>
              </g>
              <g transform="translate(20, 90)">
                <rect width="220" height="50" rx="8" fill="#EAECEF" />
                <text x="18" y="30" fill="#141619" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontSize="14" fontWeight="700">
                  4 Cluster Subject Grades
                </text>
              </g>
              <g transform="translate(20, 160)">
                <rect width="220" height="50" rx="8" fill="#EAECEF" />
                <text x="18" y="30" fill="#141619" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontSize="14" fontWeight="700">
                  HEF Household Band (1–5)
                </text>
              </g>
              <g transform="translate(20, 230)">
                <rect width="220" height="50" rx="8" fill="#EAECEF" />
                <text x="18" y="30" fill="#141619" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontSize="14" fontWeight="700">
                  County &amp; Hostel Budget
                </text>
              </g>

              {/* Center Convergence Node */}
              <g transform="translate(490, 96)">
                <rect width="240" height="108" rx="12" fill="#161B26" />
                <text x="24" y="46" fill="#C79B37" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontSize="13" fontWeight="700">
                  CHUOCONNECT ENGINE
                </text>
                <text x="24" y="72" fill="#F4F5F7" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontSize="16" fontWeight="800">
                  48-Pt Cluster &amp; Fee Match
                </text>
              </g>

              {/* Right Output Node */}
              <g transform="translate(810, 96)">
                <rect width="250" height="108" rx="12" fill="#C79B37" />
                <text x="22" y="46" fill="#141619" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontSize="13" fontWeight="800">
                  VERIFIED PLACEMENT
                </text>
                <text x="22" y="72" fill="#141619" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontSize="16" fontWeight="800">
                  68 Accredited Campuses
                </text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* 5. STATS: Column Aligned on the Decimal */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="editorial-axis-row" style={{ marginBottom: 40 }}>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '34ch', margin: 0 }}>
              Key national placement figures aligned on the decimal from official CUE, TVETA, KUCCPS, and HEF schedules.
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.625rem, 3.05vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.04,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              National Placement Figures.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {DECIMAL_STATS.map(item => (
              <div
                key={item.unit}
                className="editorial-axis-row"
                style={{
                  padding: '8px 0',
                  alignItems: 'baseline',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <span
                    className="tabular-nums"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(1.625rem, 3.05vw, 2.75rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.045em',
                      lineHeight: 0.95,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {item.figure}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                    {item.unit}
                  </span>
                </div>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, maxWidth: '58ch' }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA: Three Photographs, Then a Field */}
      <section style={{ background: 'var(--bg-secondary)', paddingTop: 'clamp(48px, 6vw, 80px)' }}>
        <div className="container">
          {/* 3-photo strip aligned to page margins */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              width: '100%',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            <div style={{ height: 240, position: 'relative' }}>
              <img src="/images/universities/usiu.jpg" alt="USIU-Africa Campus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(18, 20, 23, 0.32)', display: 'flex', alignItems: 'flex-start', padding: '18px 22px' }}>
                <span style={{ color: '#F4F5F7', fontSize: '0.875rem', fontWeight: 700 }}>USIU-Africa · Roysambu, Nairobi</span>
              </div>
            </div>
            <div style={{ height: 240, position: 'relative' }}>
              <img src="/images/universities/chuka.jpg" alt="Chuka University Campus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(18, 20, 23, 0.32)', display: 'flex', alignItems: 'flex-start', padding: '18px 22px' }}>
                <span style={{ color: '#F4F5F7', fontSize: '0.875rem', fontWeight: 700 }}>Chuka University · Tharaka-Nithi</span>
              </div>
            </div>
            <div style={{ height: 240, position: 'relative' }}>
              <img src="/images/universities/tuk.jpg" alt="Technical University of Kenya" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(18, 20, 23, 0.32)', display: 'flex', alignItems: 'flex-start', padding: '18px 22px' }}>
                <span style={{ color: '#F4F5F7', fontSize: '0.875rem', fontWeight: 700 }}>Technical University of Kenya · Nairobi CBD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flat Field Block Below */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: 'clamp(48px, 7vw, 88px) 0',
          }}
        >
          <div className="container">
            <div className="editorial-axis-row">
              <div style={{ paddingRight: 28 }}>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '32ch', margin: 0 }}>
                  Free for all Kenyan KCSE candidates, parents, and high school career masters preparing for 2026 / 2027 placement.
                </p>
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(1.625rem, 3.05vw, 2.75rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    lineHeight: 1.04,
                    color: 'var(--text-primary)',
                    marginBottom: 28,
                  }}
                >
                  Verify Your Placement Early.
                </h2>
                <Link
                  href="/calculator"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    paddingBottom: 6,
                    borderBottom: '4px solid var(--accent-gold)',
                  }}
                >
                  Calculate Your Exact Cluster Points <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
