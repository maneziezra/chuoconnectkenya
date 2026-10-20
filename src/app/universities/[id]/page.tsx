import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Users, Calendar, Star, ArrowLeft,
  Phone, Mail, Globe, BookOpen, Dumbbell, FlaskConical,
  Building2, Wifi, CheckCircle, Play,  Lightbulb, Scale
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
    description: uni.overview};
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
    image: (uniData as any).coverUrl || (uniData as any).logoUrl || uniData.image || '/images/universities/uon.jpg'
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

  const TAB_SECTIONS = [
    { id: 'overview', label: 'Overview' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: `Reviews (${uni.reviewCount ?? reviews.length})` },
    { id: 'ambassadors', label: 'Ambassadors' },
  ];

  return (
    <>
      {/* Hero Banner */}
      <div className="uni-hero-banner">
        <img
          src={uni.image}
          alt={`${uni.name} campus`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(11,17,32,0.35) 0%, rgba(11,17,32,0.92) 100%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <Link
            href="/universities"
            className="btn btn-ghost btn-sm"
            style={{
              color: 'rgba(255,255,255,0.9)',
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.22)',
              borderTop: '1px solid rgba(255,255,255,0.45)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              marginBottom: 20,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.84rem',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={15} /> Back to Directory
          </Link>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <span className={`badge ${uni.type === 'Public' ? 'badge-navy' : 'badge-gold'}`} style={{ borderRadius: 'var(--radius-sm)', letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.72rem' }}>{uni.type}</span>
                <span className="badge badge-green" style={{ borderRadius: 'var(--radius-sm)', letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.72rem' }}>Rank #{uni.ranking}</span>
                {uni.virtualTourUrl && (
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(255,255,255,0.16)',
                      backdropFilter: 'blur(12px)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255,255,255,0.25)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.72rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <Play size={11} fill="white" /> Virtual Tour
                  </span>
                )}
              </div>
              <h1 className="text-h1" style={{ color: '#FFFFFF', letterSpacing: '-0.028em' }}>{uni.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, color: 'rgba(255,255,255,0.82)', fontSize: '0.92rem', flexWrap: 'wrap' }}>
                <span><MapPin size={14} style={{ display: 'inline', marginRight: 4 }} /> {uni.county}</span>
                <span><Calendar size={14} style={{ display: 'inline', marginRight: 4 }} /> Est. {uni.established}</span>
                <span><Users size={14} style={{ display: 'inline', marginRight: 4 }} /> {uni.students} students</span>
                {uni.campusSize && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={14} /> {uni.campusSize}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              {uni.rating && (
                <div
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderTop: '1px solid rgba(255,255,255,0.5)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 24px',
                    textAlign: 'center',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <div style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--gold-primary)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{uni.rating.toFixed(1)}</div>
                  <div className="stars" style={{ margin: '4px 0', display: 'flex', justifyContent: 'center', gap: 2, color: 'var(--gold-primary)' }}>
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.8rem', letterSpacing: '-0.01em' }}>{uni.reviewCount?.toLocaleString()} reviews</div>
                </div>
              )}
              <CompareButton universityId={uni.id} universityName={uni.name} universityAbbrev={uni.abbrev} />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation: Apple Translucent Glass Pill Bar */}
      <div
        style={{
          background: 'var(--apple-glass-bg)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid var(--border-light)',
          borderTop: '1px solid var(--apple-glass-highlight)',
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
                className="uni-tab-link hover-text-navy"
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36, minWidth: 0 }}>

              {/* Overview Section */}
              <div id="overview">
                <InfoCard title="Overview">
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{uni.overview}</p>
                </InfoCard>
              </div>

              {/* History */}
              {uni.history && (
                <InfoCard title="History & Background">
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{uni.history}</p>
                </InfoCard>
              )}

              {/* Academic Programmes */}
              {uniCourses.length > 0 && (
                <InfoCard title="Academic Programmes" icon={<BookOpen size={18} />}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {uniCourses.map(course => (
                      <div key={course.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                        padding: '12px 16px', background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)'}}>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{course.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{course.clusterGroup} · {course.duration}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="badge badge-gold">{course.minPoints}+ pts</span>
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
                <InfoCard title="Entry Requirements">
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{uni.entryRequirements}</p>
                </InfoCard>
              )}

              {/* Accommodation */}
              <InfoCard title="Accommodation" icon={<Building2 size={18} />}>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{uni.accommodation}</p>
              </InfoCard>

              {/* Facilities */}
              <InfoCard title="Campus Facilities">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {uni.facilities?.map(f => (
                    <span key={f} style={{
                      padding: '6px 14px', background: 'var(--navy-light)', color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 500,
                      display: 'flex', alignItems: 'center', gap: 6}}>
                      <CheckCircle size={14} style={{ color: 'var(--gold-primary)' }} /> {f}
                    </span>
                  ))}
                </div>
              </InfoCard>

              {/* Sports */}
              {uni.sportsInfo && (
                <InfoCard title="Sports & Recreation" icon={<Dumbbell size={18} />}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{uni.sportsInfo}</p>
                </InfoCard>
              )}

              {/* Clubs & Societies */}
              {uni.clubsAndSocieties && uni.clubsAndSocieties.length > 0 && (
                <InfoCard title="Clubs & Societies">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {uni.clubsAndSocieties.map(c => (
                      <span key={c} style={{
                        padding: '5px 12px', background: 'var(--gold-glow)', color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 500,
                        border: '1px solid rgba(199,155,55,0.2)'}}>{c}</span>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Library */}
              {uni.libraryInfo && (
                <InfoCard title="Library" icon={<BookOpen size={18} />}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{uni.libraryInfo}</p>
                </InfoCard>
              )}

              {/* Labs */}
              {uni.labsInfo && (
                <InfoCard title="Laboratories" icon={<FlaskConical size={18} />}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{uni.labsInfo}</p>
                </InfoCard>
              )}

              {/* Innovation Hub */}
              {uni.innovationHub && (
                <InfoCard title="Innovation Hub" icon={<Wifi size={18} />}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{uni.innovationHub}</p>
                </InfoCard>
              )}

              {/* Gallery Section */}
              <div id="gallery">
                <GallerySection
                  universityId={uni.id}
                  virtualTourUrl={uni.virtualTourUrl}
                  items={uni.gallery || universityGalleries[uni.id]}
                />
              </div>

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
                  background: 'var(--navy-deep)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 12px 32px -8px rgba(17, 24, 39, 0.2)',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gold-primary)', marginBottom: 8 }}>Tuition Fees</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--gold-primary)', letterSpacing: '-0.02em' }}>{uni.fees}</div>
                <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.72)', marginTop: 8, lineHeight: 1.55 }}>Fees vary by programme. Contact admissions for exact figures.</p>
              </div>

              {/* Admission Enquiry */}
              <div
                className="card card-body"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--gold-primary)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                  boxShadow: '0 8px 24px rgba(199, 155, 55, 0.12)',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', letterSpacing: '-0.015em', marginBottom: 8 }}>Interested in {uni.abbrev}?</div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                  Ask for the prospectus, exact fees or an admissions call. We pass your details to the university with your consent.
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
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                }}
              >
                <div className="footer-heading" style={{ color: 'var(--text-primary)', marginBottom: 16, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.76rem', fontWeight: 700 }}>Quick Facts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Established', value: uni.established.toString() },
                    { label: 'Students', value: uni.students },
                    { label: 'County', value: uni.county },
                    { label: 'Ranking', value: `#${uni.ranking} in Kenya` },
                    { label: 'Type', value: uni.type },
                    ...(uni.campusSize ? [{ label: 'Campus Size', value: uni.campusSize }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="fact-item-row">
                      <span style={{ color: 'var(--text-tertiary)', flexShrink: 0, fontSize: '0.88rem' }}>{label}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right', wordBreak: 'break-word', fontSize: '0.9rem' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              {(uni.contactEmail || uni.contactPhone || uni.website) && (
                <div
                  className="card card-body"
                  style={{
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-light)',
                    borderTop: '1px solid var(--apple-glass-highlight)',
                  }}
                >
                  <div className="footer-heading" style={{ color: 'var(--text-primary)', marginBottom: 16, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.76rem', fontWeight: 700 }}>Contact & Links</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {uni.website && (
                      <a
                        href={uni.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-interactive-link"
                        title="Official Website"
                        style={{ borderRadius: 'var(--radius-md)' }}
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
                        style={{ borderRadius: 'var(--radius-md)' }}
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
                        style={{ borderRadius: 'var(--radius-md)' }}
                      >
                        <Phone size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                        <span>{uni.contactPhone}</span>
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
                      Visit Official Website
                    </a>
                  )}
                </div>
              )}

              {/* CTA */}
              <div
                className="card card-body"
                style={{
                  background: 'var(--gold-glow)',
                  border: '1px solid rgba(199,155,55,0.25)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.015em' }}>
                  <Lightbulb size={18} style={{ color: 'var(--gold-primary)' }} /> Get Personalised Recommendations
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>Enter your KCSE grades to see if you qualify for programmes here.</p>
                <Link href="/calculator" className="btn btn-navy" style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>Check Eligibility</Link>
              </div>

              {/* Compare CTA */}
              <div
                className="card card-body"
                style={{
                  background: 'var(--navy-light)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.015em' }}>
                  <Scale size={18} style={{ color: 'var(--gold-primary)' }} /> Compare This Campus
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>Add to your comparison list to evaluate against other institutions side-by-side.</p>
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
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        borderTop: '1px solid var(--apple-glass-highlight)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <h2 style={{
        fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600,
        letterSpacing: '-0.02em',
        color: 'var(--text-primary)', marginBottom: 18, paddingBottom: 14,
        borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 10}}>
        {icon && <span style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center' }}>{icon}</span>}
        {title}
      </h2>
      <div style={{ lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  );
}
