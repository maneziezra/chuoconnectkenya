import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  GraduationCap,
  Calculator,
  Clock,
  Wallet,
  CheckCircle2,
  ArrowLeft,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import {
  GRADE_GUIDES,
  getGradeGuideBySlug,
  getCoursesForGradeGuide,
} from '@/lib/data/gradeGuides';
import { universitiesData } from '@/lib/data/universities';
import { estimateCourseAnnualCostKes } from '@/lib/utils/kuccps';
import ExpressInquiryModal from '@/components/university/ExpressInquiryModal';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return GRADE_GUIDES.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGradeGuideBySlug(slug);
  if (!guide) {
    return { title: 'KCSE Grade Guide' };
  }
  const cleanTitle = guide.metaTitle.replace(/\s*\|\s*Chuo Connect.*$/i, '');
  return {
    title: cleanTitle,
    description: guide.metaDescription,
    alternates: {
      canonical: `/grades/${guide.slug}`,
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      type: 'article',
    },
  };
}

export default async function GradeDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = getGradeGuideBySlug(slug);
  if (!guide) notFound();

  const { degreeCourses, diplomaCourses } = getCoursesForGradeGuide(guide);
  const uniMap = new Map(universitiesData.map(u => [u.id, u]));

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingBottom: 80 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero Section */}
      <div style={{ padding: '32px 20px 0' }}>
        <div
          style={{
            position: 'relative',
            border: '2px solid var(--border-medium)',
            borderRadius: 20,
            boxShadow: 'var(--shadow-neo)',
            background: 'var(--bg-primary)',
            padding: '40px 36px',
            overflow: 'hidden',
          }}
        >
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
              <Link
                href="/grades"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={15} /> All KCSE Grade Guides
              </Link>

              {/* Quick Grade Switcher Pills */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {GRADE_GUIDES.map(g => (
                  <Link
                    key={g.slug}
                    href={`/grades/${g.slug}`}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      fontFamily: 'JetBrains Mono, monospace',
                      background: g.slug === guide.slug ? 'var(--navy-deep)' : 'var(--bg-secondary)',
                      color: g.slug === guide.slug ? 'var(--gold-primary)' : 'var(--text-secondary)',
                      border: '1px solid var(--border-medium)',
                    }}
                  >
                    {g.gradeLabel}
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              <span
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  background: 'var(--navy-deep)',
                  color: 'var(--gold-primary)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                }}
              >
                KCSE Mean Grade {guide.gradeLabel}
              </span>
              <span
                style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  background: 'var(--gold-glow)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                Aggregate: {guide.aggregateRange} • {guide.typicalClusterRange}
              </span>
            </div>

            <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 14, maxWidth: 860 }}>
              {guide.headline}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', maxWidth: 780, lineHeight: 1.65, marginBottom: 24 }}>
              {guide.summary}
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/calculator" className="btn btn-gold">
                <Calculator size={16} /> Test Your Exact {guide.gradeLabel} Cluster Score
              </Link>
              <Link href="/universities" className="btn btn-outline">
                Compare Accredited Universities
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Strategy & HEF Funding Callout Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
            <div className="card" style={{ padding: 24, background: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: 14 }}>
                <Sparkles size={18} style={{ color: 'var(--gold-primary)' }} />
                KUCCPS Revision Strategy for Grade {guide.gradeLabel}
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {guide.strategyAdvice.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="card" style={{ padding: 24, background: 'var(--navy-deep)', color: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--gold-primary)', fontSize: '1.02rem', marginBottom: 12 }}>
                <Wallet size={18} />
                HEF Band 1–5 Scholarship & HELB Loan Eligibility
              </div>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: 16 }}>
                {guide.hefFundingNote}
              </p>
              <Link href="/calculator" className="btn btn-gold btn-sm">
                Simulate Your Household Fee Share
              </Link>
            </div>
          </div>

          {/* Degree Programmes Section (if degree eligible) */}
          {guide.isDegreeEligible && degreeCourses.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <div style={{ marginBottom: 20 }}>
                <h2 className="text-h2" style={{ fontSize: '1.5rem', marginBottom: 6 }}>
                  Qualifying Bachelor’s Degree Programmes for Grade {guide.gradeLabel}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
                  Showing degree courses with indicative KUCCPS cutoffs matching {guide.gradeLabel} candidates ({guide.typicalClusterRange}). Click <strong>Enquire</strong> to request admission & fee details directly from the university.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                {degreeCourses.map(course => {
                  const annualCost = estimateCourseAnnualCostKes(course);
                  const offeredUnis = course.universityIds
                    .map(id => uniMap.get(id))
                    .filter((u): u is NonNullable<typeof u> => Boolean(u));
                  const primaryUni = offeredUnis[0];

                  return (
                    <div
                      key={course.id}
                      className="card"
                      style={{
                        padding: 22,
                        background: 'var(--bg-primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 16,
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                          <span className="badge badge-navy" style={{ fontSize: '0.72rem' }}>
                            {course.clusterGroup.split(':')[0]}
                          </span>
                          <span
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: 6,
                              background: 'var(--gold-glow)',
                              color: 'var(--text-primary)',
                            }}
                          >
                            Cutoff: {course.minPoints.toFixed(1)} / 48
                          </span>
                        </div>

                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.12rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3 }}>
                          {course.title}
                        </h3>
                        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 12 }}>
                          {course.description}
                        </p>

                        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={13} /> {course.duration}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Wallet size={13} style={{ color: 'var(--gold-primary)' }} /> Est. KES {annualCost.toLocaleString()}/yr
                          </span>
                        </div>

                        {offeredUnis.length > 0 && (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {offeredUnis.slice(0, 4).map(u => (
                              <Link
                                key={u.id}
                                href={`/universities/${u.id}`}
                                style={{
                                  fontSize: '0.74rem',
                                  padding: '2px 8px',
                                  borderRadius: 6,
                                  background: 'var(--bg-secondary)',
                                  border: '1px solid var(--border-light)',
                                  color: 'var(--text-secondary)',
                                  textDecoration: 'none',
                                  fontWeight: 600,
                                }}
                              >
                                {u.abbrev || u.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ paddingTop: 14, borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                        {course.careerOutcomes?.[0] && (
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>
                            Career: <strong style={{ color: 'var(--text-secondary)' }}>{course.careerOutcomes[0]}</strong>
                          </span>
                        )}
                        {primaryUni && (
                          <ExpressInquiryModal
                            source="course_page"
                            universityId={primaryUni.id}
                            universityName={primaryUni.name}
                            universityOptions={offeredUnis.map(u => ({ id: u.id, name: u.name }))}
                            defaultCourse={course.title}
                            prefill={{ meanGrade: guide.gradesIncluded[0] }}
                            triggerLabel="Enquire"
                            triggerClassName="btn btn-gold btn-sm"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Diploma & TVET Pathways Section */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 className="text-h2" style={{ fontSize: '1.45rem', marginBottom: 6 }}>
                {guide.isDegreeEligible
                  ? 'Alternative Accelerated Diploma & Practical TVET Options'
                  : `Accredited Diploma-to-Degree & KMTC Programmes for Grade ${guide.gradeLabel}`}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
                Accredited 2–3 year Diploma pathways with direct credit exemptions into 2nd Year of a Bachelor’s degree.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {diplomaCourses.map(dip => {
                const offeredUnis = dip.universityIds
                  .map(id => uniMap.get(id))
                  .filter((u): u is NonNullable<typeof u> => Boolean(u));
                const primaryUni = offeredUnis[0] || universitiesData[0];

                return (
                  <div
                    key={dip.id}
                    className="card"
                    style={{
                      padding: 22,
                      background: 'var(--bg-primary)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 14,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                          {dip.level} • Min Grade {dip.minMeanGrade || 'C-'}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {dip.duration}
                        </span>
                      </div>

                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                        {dip.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                        {dip.description}
                      </p>
                    </div>

                    <div style={{ paddingTop: 12, borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Fee Cap: <strong>KES {(dip.estimatedAnnualCostKes || 67189).toLocaleString()}/yr</strong>
                      </span>
                      <ExpressInquiryModal
                        source="course_page"
                        universityId={primaryUni.id}
                        universityName={primaryUni.name}
                        universityOptions={offeredUnis.length > 0 ? offeredUnis.map(u => ({ id: u.id, name: u.name })) : undefined}
                        defaultCourse={dip.title}
                        prefill={{ meanGrade: guide.gradesIncluded[0] }}
                        triggerLabel="Request Intake Info"
                        triggerClassName="btn btn-outline btn-sm"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="card" style={{ padding: 28, background: 'var(--bg-primary)' }}>
            <h2 className="text-h2" style={{ fontSize: '1.35rem', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
              <HelpCircle size={20} style={{ color: 'var(--gold-primary)' }} />
              Frequently Asked Questions — KCSE Grade {guide.gradeLabel}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {guide.faqs.map((faq, idx) => (
                <div key={idx} style={{ padding: 18, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {faq.question}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
