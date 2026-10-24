import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Users, Calendar, Star, ArrowLeft,
  Phone, Mail, Globe, BookOpen, Dumbbell, FlaskConical,
  Building2, Wifi, CheckCircle, Play, Lightbulb, Scale
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { University, Course, Review, Ambassador } from '@/lib/types';
import { universitiesData } from '@/lib/data/universities';
import { universityGalleries } from '@/lib/data/universityGalleries';
import { coursesData as localCourses } from '@/lib/data/courses';
import ReviewSection from '@/components/university/ReviewSection';
import AmbassadorSection from '@/components/university/AmbassadorSection';
import GallerySection from '@/components/university/GallerySection';
import CompareButton from '@/components/university/CompareButton';
import ExpressInquiryModal from '@/components/university/ExpressInquiryModal';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const normalizedId = id.toLowerCase();
  const supabase = await createClient();
  const { data: dbUni } = await supabase.from('universities').select('*').eq('id', id).single();
  const uni = dbUni || universitiesData.find(u => u.id === id || u.id === normalizedId || u.abbrev?.toLowerCase() === normalizedId);
  if (!uni) return { title: 'Not Found' };
  return {
    title: `${uni.name} | Campus Profile`,
    description: uni.overview,
  };
}

export default async function CampusProfilePage({ params }: Props) {
  const { id } = await params;
  const normalizedId = id.toLowerCase();
  const supabase = await createClient();

  const { data: dbUniData } = await supabase.from('universities').select('*').eq('id', id).single();
  const uniData = dbUniData || universitiesData.find(u => u.id === id || u.id === normalizedId || u.abbrev?.toLowerCase() === normalizedId);
  if (!uniData) notFound();
  const uni = {
    ...uniData,
    image: (uniData as any).coverUrl || (uniData as any).logoUrl || uniData.image || '',
  } as University;

  const { data: dbCourses } = await supabase.from('courses').select('*').contains('universityIds', [id]);
  const fallbackCourses = localCourses.filter(c => c.universityIds.includes(id));
  const seenCourseIds = new Set((dbCourses || []).map((c: Course) => c.id));
  const uniCourses = [
    ...((dbCourses || []) as Course[]),
    ...fallbackCourses.filter(c => !seenCourseIds.has(c.id)),
  ];

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*')
    .eq('universityId', id)
    .order('createdAt', { ascending: false })
    .limit(5);
  const reviews = (reviewsData || []) as Review[];

  const { data: ambassadorsData } = await supabase
    .from('ambassadors')
    .select('*')
    .eq('universityId', id)
    .limit(4);
  const ambassadors = (ambassadorsData || []) as Ambassador[];

  const hasPhoto = Boolean(uni.image && uni.image.trim().length > 0);
  const galleryItems = uni.gallery || universityGalleries[uni.id] || [];

  const TAB_SECTIONS = [
    { id: 'overview', label: 'Overview' },
    ...(galleryItems.length > 0 ? [{ id: 'gallery', label: 'Gallery' }] : []),
    { id: 'reviews', label: `Reviews (${uni.reviewCount ?? reviews.length})` },
    { id: 'ambassadors', label: 'Ambassadors' },
  ];

  return (
    <>
      {/* Editorial Hero Banner */}
      <div className="uni-hero-banner">
        {hasPhoto && (
          <>
            <img
              src={uni.image}
              alt={`${uni.name} campus`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(18, 20, 23, 0.74)' }} />
          </>
        )}

        <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <Link
            href="/universities"
            className="btn btn-sm"
            style={{
              color: '#F4F5F7',
              background: 'rgba(244, 245, 247, 0.14)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
              marginBottom: 24,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={15} /> Back to Directory
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 28, flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 780 }}>
              <h1 className="text-h1" style={{ color: '#F4F5F7', letterSpacing: '-0.04em', fontSize: 'clamp(1.625rem, 2.5vw, 2.25rem)' }}>{uni.name}</h1>
              <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                <span className="badge badge-gold">{uni.type}</span>
                <span className="badge badge-green tabular-nums">Rank #{uni.ranking}</span>
                {uni.virtualTourUrl && (
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(244, 245, 247, 0.16)',
                      color: '#F4F5F7',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Play size={11} fill="white" /> Virtual Tour
                  </span>
                )}
              </div>
              <div className="tabular-nums" style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 14, color: 'rgba(244, 245, 247, 0.84)', fontSize: '0.94rem', flexWrap: 'wrap' }}>
                <span><MapPin size={14} style={{ display: 'inline', marginRight: 4 }} /> {uni.county} County</span>
                <span><Calendar size={14} style={{ display: 'inline', marginRight: 4 }} /> Est. {uni.established}</span>
                <span><Users size={14} style={{ display: 'inline', marginRight: 4 }} /> {uni.students} students</span>
                {uni.campusSize && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={14} /> {uni.campusSize}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              {uni.rating && (
                <div
                  style={{
                    background: 'rgba(244, 245, 247, 0.12)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px 26px',
                    textAlign: 'center',
                  }}
                >
                  <div className="tabular-nums" style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--gold-primary)', fontFamily: 'var(--font-sans)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {uni.rating.toFixed(1)}
                  </div>
                  <div style={{ margin: '6px 0', display: 'flex', justifyContent: 'center', gap: 2, color: 'var(--gold-primary)' }}>
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                  </div>
                  <div className="tabular-nums" style={{ color: 'rgba(244, 245, 247, 0.78)', fontSize: '0.875rem' }}>
                    {uni.reviewCount?.toLocaleString()} reviews
                  </div>
                </div>
              )}
              <CompareButton universityId={uni.id} universityName={uni.name} universityAbbrev={uni.abbrev} />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          position: 'sticky',
          top: 'var(--nav-height)',
          zIndex: 40,
        }}
      >
        <div className="container">
          <nav className="uni-tab-nav">
            {TAB_SECTIONS.map(tab => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className="uni-tab-link"
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <section className="section-sm">
        <div className="container">
          <div className="uni-profile-grid">
            {/* Left: Main Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0 }}>
              {/* Overview Section */}
              <div id="overview">
                <InfoCard title="Institutional Overview">
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '68ch' }}>{uni.overview}</p>
                </InfoCard>
              </div>

              {/* History */}
              {uni.history && (
                <InfoCard title="History & Charter">
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '68ch' }}>{uni.history}</p>
                </InfoCard>
              )}

              {/* Academic Programmes */}
              {uniCourses.length > 0 && (
                <InfoCard title="Accredited Programmes" icon={<BookOpen size={18} />}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {uniCourses.map(course => (
                      <div
                        key={course.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 16,
                          flexWrap: 'wrap',
                          padding: '16px 20px',
                          background: 'var(--bg-primary)',
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.96rem' }}>{course.title}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>{course.clusterGroup} · {course.duration}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span className="badge badge-gold tabular-nums">{course.minPoints}+ pts</span>
                          <ExpressInquiryModal
                            source="university_page"
                            universityId={uni.id}
                            universityName={uni.name}
                            defaultCourse={course.title}
                            courseOptions={[course.title]}
                            fallbackContact={{ email: uni.contactEmail, phone: uni.contactPhone }}
                            triggerLabel="Enquire"
                            triggerClassName="btn btn-navy btn-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Entry Requirements */}
              {uni.entryRequirements && (
                <InfoCard title="Admission Requirements">
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '68ch' }}>{uni.entryRequirements}</p>
                </InfoCard>
              )}

              {/* Accommodation */}
              <InfoCard title="Student Accommodation" icon={<Building2 size={18} />}>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '68ch' }}>{uni.accommodation}</p>
              </InfoCard>

              {/* Facilities */}
              <InfoCard title="Campus Facilities">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {uni.facilities?.map(f => (
                    <span
                      key={f}
                      style={{
                        padding: '8px 16px',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <CheckCircle size={14} style={{ color: 'var(--gold-primary)' }} /> {f}
                    </span>
                  ))}
                </div>
              </InfoCard>

              {/* Sports */}
              {uni.sportsInfo && (
                <InfoCard title="Sports & Athletics" icon={<Dumbbell size={18} />}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '68ch' }}>{uni.sportsInfo}</p>
                </InfoCard>
              )}

              {/* Clubs & Societies */}
              {uni.clubsAndSocieties && uni.clubsAndSocieties.length > 0 && (
                <InfoCard title="Student Societies">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {uni.clubsAndSocieties.map(c => (
                      <span
                        key={c}
                        style={{
                          padding: '7px 14px',
                          background: 'var(--gold-glow)',
                          color: 'var(--text-primary)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Library */}
              {uni.libraryInfo && (
                <InfoCard title="University Library" icon={<BookOpen size={18} />}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '68ch' }}>{uni.libraryInfo}</p>
                </InfoCard>
              )}

              {/* Labs */}
              {uni.labsInfo && (
                <InfoCard title="Research Laboratories" icon={<FlaskConical size={18} />}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '68ch' }}>{uni.labsInfo}</p>
                </InfoCard>
              )}

              {/* Innovation Hub */}
              {uni.innovationHub && (
                <InfoCard title="Innovation & Incubation" icon={<Wifi size={18} />}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '68ch' }}>{uni.innovationHub}</p>
                </InfoCard>
              )}

              {/* Gallery Section (Rendered when authentic campus gallery photos exist) */}
              {galleryItems.length > 0 && (
                <div id="gallery">
                  <GallerySection
                    universityId={uni.id}
                    virtualTourUrl={uni.virtualTourUrl}
                    items={galleryItems}
                  />
                </div>
              )}

              {/* Reviews Section */}
              <div id="reviews">
                <ReviewSection universityId={uni.id} initialReviews={reviews} />
              </div>

              {/* Ambassadors Section */}
              <div id="ambassadors">
                <AmbassadorSection universityId={uni.id} initialAmbassadors={ambassadors} />
              </div>
            </div>

            {/* Right: Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
              {/* Fee Card */}
              <div
                className="card card-body"
                style={{
                  background: 'var(--brand-navy)',
                  color: '#F6F5F2',
                  borderRadius: 'var(--radius-lg)',
                  padding: 28,
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold-primary)', marginBottom: 8 }}>
                  Annual Tuition Range
                </div>
                <div className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-sans)', color: 'var(--gold-primary)', letterSpacing: '-0.03em' }}>
                  {uni.fees}
                </div>
                <p style={{ fontSize: '0.86rem', color: 'rgba(246, 245, 242, 0.78)', marginTop: 10, lineHeight: 1.55 }}>
                  Fees depend on degree cluster and HEF/HELB household band allocation.
                </p>
              </div>

              {/* Admission Enquiry */}
              <div
                className="card card-body"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-secondary)',
                  padding: 28,
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.08rem', letterSpacing: '-0.02em', marginBottom: 8 }}>
                  Apply or Enquire at {uni.abbrev}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.55 }}>
                  Request the current academic prospectus, fee structure, or direct admissions guidance.
                </p>
                <ExpressInquiryModal
                  source="university_page"
                  universityId={uni.id}
                  universityName={uni.name}
                  courseOptions={uniCourses.map(c => c.title)}
                  fallbackContact={{ email: uni.contactEmail, phone: uni.contactPhone }}
                  triggerStyle={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}
                />
              </div>

              {/* Quick Facts */}
              <div
                className="card card-body"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  padding: 28,
                }}
              >
                <div className="footer-heading" style={{ color: 'var(--text-primary)', marginBottom: 18 }}>
                  Institutional Ledger
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Established', value: uni.established.toString() },
                    { label: 'Enrollment', value: uni.students },
                    { label: 'County', value: uni.county },
                    { label: 'National Rank', value: `#${uni.ranking} in Kenya` },
                    { label: 'Charter Type', value: uni.type },
                    ...(uni.campusSize ? [{ label: 'Campus Area', value: uni.campusSize }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="fact-item-row">
                      <span style={{ color: 'var(--text-secondary)', flexShrink: 0, fontSize: '0.88rem' }}>{label}</span>
                      <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right', wordBreak: 'break-word', fontSize: '0.9rem' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              {(uni.contactEmail || uni.contactPhone || uni.website) && (
                <div
                  className="card card-body"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    padding: 28,
                  }}
                >
                  <div className="footer-heading" style={{ color: 'var(--text-primary)', marginBottom: 18 }}>
                    Official Admissions Desk
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {uni.website && (
                      <a
                        href={uni.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-interactive-link"
                        title="Official Website"
                      >
                        <Globe size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                        <span style={{ overflowWrap: 'anywhere' }}>{uni.website.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}
                    {uni.contactEmail && (
                      <a
                        href={`mailto:${uni.contactEmail}`}
                        className="contact-interactive-link"
                        title="Email Admissions"
                      >
                        <Mail size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                        <span style={{ overflowWrap: 'anywhere' }}>{uni.contactEmail}</span>
                      </a>
                    )}
                    {uni.contactPhone && (
                      <a
                        href={`tel:${uni.contactPhone}`}
                        className="contact-interactive-link"
                        title="Call Admissions"
                      >
                        <Phone size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                        <span className="tabular-nums">{uni.contactPhone}</span>
                      </a>
                    )}
                  </div>
                  {uni.website && (
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-gold"
                      style={{ marginTop: 18, width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}
                    >
                      Open Official Portal
                    </a>
                  )}
                </div>
              )}

              {/* CTA */}
              <div
                className="card card-body"
                style={{
                  background: 'var(--gold-glow)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 28,
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.015em' }}>
                  <Lightbulb size={18} style={{ color: 'var(--gold-primary)' }} /> Check Cluster Eligibility
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.55 }}>
                  Enter your KCSE subject grades to calculate weighted KUCCPS cluster points for {uni.abbrev}.
                </p>
                <Link href="/calculator" className="btn btn-navy" style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>
                  Calculate Cluster Points
                </Link>
              </div>

              {/* Compare CTA */}
              <div
                className="card card-body"
                style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 28,
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.015em' }}>
                  <Scale size={18} style={{ color: 'var(--gold-primary)' }} /> Compare Side by Side
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.55 }}>
                  Add {uni.abbrev} to your comparison sheet to evaluate fees, facilities, and rankings.
                </p>
                <CompareButton universityId={uni.id} universityName={uni.name} universityAbbrev={uni.abbrev} fullWidth />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      className="card card-body"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: 32,
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1.25rem',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: 'var(--text-primary)',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {icon && <span style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center' }}>{icon}</span>}
        {title}
      </h2>
      <div style={{ lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}
