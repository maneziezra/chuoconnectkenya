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
import ReviewSection from '@/components/university/ReviewSection';
import AmbassadorSection from '@/components/university/AmbassadorSection';
import GallerySection from '@/components/university/GallerySection';
import CompareButton from '@/components/university/CompareButton';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: uni } = await supabase.from('universities').select('*').eq('id', id).single();
  if (!uni) return { title: 'Not Found' };
  return {
    title: `${uni.name} | Campus Profile`,
    description: uni.overview};
}

export default async function CampusProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: uniData } = await supabase.from('universities').select('*').eq('id', id).single();
  if (!uniData) notFound();
  const uni = {
    ...uniData,
    image: uniData.coverUrl || uniData.logoUrl || uniData.image || '/images/universities/uon.jpg'
  } as University;

  const { data: coursesData } = await supabase.from('courses').select('*').contains('universityIds', [id]);
  const uniCourses = (coursesData || []) as Course[];

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
      <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        <img src={uni.image} alt={`${uni.name} campus`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(26,35,56,0.25) 0%, rgba(26,35,56,0.88) 100%)' }} />
        <div className="container" style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
          <Link href="/universities" className="btn btn-ghost btn-sm" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 16, display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Back to Directory
          </Link>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span className={`badge ${uni.type === 'Public' ? 'badge-navy' : 'badge-gold'}`}>{uni.type}</span>
                <span className="badge badge-green">Rank #{uni.ranking}</span>
                {uni.virtualTourUrl && <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}><Play size={12} /> Virtual Tour</span>}
              </div>
              <h1 className="text-h1" style={{ color: 'white' }}>{uni.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                <span><MapPin size={14} style={{ display: 'inline' }} /> {uni.county}</span>
                <span><Calendar size={14} style={{ display: 'inline' }} /> Est. {uni.established}</span>
                <span><Users size={14} style={{ display: 'inline' }} /> {uni.students} students</span>
                {uni.campusSize && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={14} /> {uni.campusSize}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              {uni.rating && (
                <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-lg)', padding: '16px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--gold-primary)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{uni.rating.toFixed(1)}</div>
                  <div className="stars" style={{ margin: '4px 0', display: 'flex', justifyContent: 'center', gap: 2, color: 'var(--gold-primary)' }}>
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem' }}>{uni.reviewCount?.toLocaleString()} reviews</div>
                </div>
              )}
              <CompareButton universityId={uni.id} universityName={uni.name} universityAbbrev={uni.abbrev} />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ background: 'white', borderBottom: '2px solid var(--border-light)', position: 'sticky', top: 'var(--nav-height)', zIndex: 40 }}>
        <div className="container">
          <nav style={{ display: 'flex', gap: 0 }}>
            {TAB_SECTIONS.map(tab => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className="hover-text-navy"
                style={{
                  padding: '16px 24px', fontSize: '0.875rem', fontWeight: 500,
                  color: 'var(--text-secondary)', textDecoration: 'none',
                  borderBottom: '2px solid transparent', marginBottom: -2,
                  transition: 'var(--transition)'}}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40 }}>
            {/* Left: Main Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

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
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 16px', background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)'}}>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--navy-deep)', fontSize: '0.95rem' }}>{course.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{course.clusterGroup} · {course.duration}</div>
                        </div>
                        <span className="badge badge-gold">{course.minPoints}+ pts</span>
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
                      padding: '6px 14px', background: 'var(--navy-light)', color: 'var(--navy-deep)',
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
                        padding: '5px 12px', background: 'var(--gold-glow)', color: 'var(--navy-deep)',
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
                <GallerySection universityId={uni.id} virtualTourUrl={uni.virtualTourUrl} />
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Fee Card */}
              <div className="card card-body" style={{ background: 'var(--navy-deep)', color: 'white' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--gold-primary)', marginBottom: 8 }}>Tuition Fees</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--gold-primary)' }}>{uni.fees}</div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', marginTop: 8 }}>Fees vary by programme. Contact admissions for exact figures.</p>
              </div>

              {/* Quick Facts */}
              <div className="card card-body">
                <div className="footer-heading" style={{ color: 'var(--navy-deep)', marginBottom: 16 }}>Quick Facts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Established', value: uni.established.toString() },
                    { label: 'Students', value: uni.students },
                    { label: 'County', value: uni.county },
                    { label: 'Ranking', value: `#${uni.ranking} in Kenya` },
                    { label: 'Type', value: uni.type },
                    ...(uni.campusSize ? [{ label: 'Campus Size', value: uni.campusSize }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
                      <span style={{ fontWeight: 600, color: 'var(--navy-deep)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              {(uni.contactEmail || uni.contactPhone || uni.website) && (
                <div className="card card-body">
                  <div className="footer-heading" style={{ color: 'var(--navy-deep)', marginBottom: 16 }}>Contact & Links</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {uni.website && (
                      <a href={uni.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--navy-deep)' }}>
                        <Globe size={14} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} /> {uni.website.replace('https://', '')}
                      </a>
                    )}
                    {uni.contactEmail && (
                      <a href={`mailto:${uni.contactEmail}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--navy-deep)' }}>
                        <Mail size={14} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} /> {uni.contactEmail}
                      </a>
                    )}
                    {uni.contactPhone && (
                      <a href={`tel:${uni.contactPhone}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--navy-deep)' }}>
                        <Phone size={14} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} /> {uni.contactPhone}
                      </a>
                    )}
                  </div>
                  {uni.website && (
                    <a href={uni.website} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
                      Visit Official Website
                    </a>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="card card-body" style={{ background: 'var(--gold-glow)', border: '1px solid rgba(199,155,55,0.3)' }}>
                <div style={{ fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><Lightbulb size={18} style={{ color: 'var(--gold-primary)' }} /> Get Personalised Recommendations</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>Enter your KCSE grades to see if you qualify for programmes here.</p>
                <Link href="/signup" className="btn btn-navy" style={{ width: '100%', justifyContent: 'center' }}>Check Eligibility</Link>
              </div>

              {/* Compare CTA */}
              <div className="card card-body" style={{ background: 'var(--navy-light)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><Scale size={18} style={{ color: 'var(--gold-primary)' }} /> Compare This Campus</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>Add to your comparison list to evaluate against other institutions side-by-side.</p>
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
    <div className="card card-body">
      <h2 style={{
        fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', fontWeight: 600,
        color: 'var(--navy-deep)', marginBottom: 16, paddingBottom: 12,
        borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 8}}>
        {icon && <span style={{ color: 'var(--gold-primary)' }}>{icon}</span>}
        {title}
      </h2>
      {children}
    </div>
  );
}
