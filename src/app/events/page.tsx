import type { Metadata } from 'next';
import { Calendar, MapPin, ExternalLink, Search, BookOpen, Trophy, Globe, Briefcase, PartyPopper, GraduationCap } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { Event } from '@/lib/types';
import ExpressInquiryModal from '@/components/university/ExpressInquiryModal';

export const metadata: Metadata = {
  title: '2026 Campus Open Days & Career Events',
  description:
    'Discover upcoming 2026/2027 campus open days, KUCCPS placement clinics, career fairs, and student hackathons at universities across Kenya.',
};

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  academic: { label: 'Academic', color: '#1D4ED8', bg: '#DBEAFE', icon: <BookOpen size={14} /> },
  sports: { label: 'Sports', color: 'var(--success-text)', bg: 'var(--success-bg)', icon: <Trophy size={14} /> },
  cultural: { label: 'Cultural', color: '#7C3AED', bg: '#EDE9FE', icon: <Globe size={14} /> },
  career: { label: 'Career Fair', color: '#B45309', bg: 'var(--warning-bg)', icon: <Briefcase size={14} /> },
  social: { label: 'Student Life', color: '#DB2777', bg: '#FCE7F3', icon: <PartyPopper size={14} /> },
  admission: { label: 'Open Day', color: '#C79B37', bg: 'rgba(199,155,55,0.15)', icon: <GraduationCap size={14} /> },
};

const FALLBACK_EVENTS: Event[] = [
  {
    id: 'evt-uon-openday',
    universityId: 'uon',
    universityName: 'University of Nairobi',
    title: 'UoN Annual Admissions Open Day & Career Clinic',
    description:
      'Tour the University of Nairobi Main Campus, meet Deans from Engineering, Medicine, Law, and Computing, and get 1-on-1 guidance on KUCCPS cluster cutoffs and HEF Band 1–5 funding.',
    date: '2026-11-14T09:00:00Z',
    endDate: '2026-11-15T16:00:00Z',
    location: 'Taifa Hall & Great Court, Main Campus, Nairobi',
    category: 'admission',
    isFeatured: true,
  },
  {
    id: 'evt-strath-tech',
    universityId: 'strath',
    universityName: 'Strathmore University',
    title: 'Strathmore @iLabAfrica Tech & Actuarial Career Fair',
    description:
      'Experience live demos from student software startups, Financial Engineering labs, and scholarship interviews for the upcoming undergraduate intake.',
    date: '2026-11-21T09:00:00Z',
    location: 'Strathmore University Auditorium, Madaraka, Nairobi',
    category: 'career',
    isFeatured: true,
  },
  {
    id: 'evt-jkuat-innovation',
    universityId: 'jkuat',
    universityName: 'JKUAT',
    title: 'JKUAT Tech Expo & Engineering Open Day',
    description:
      'Explore student robotics, agritech, civil engineering labs, and BSc Computer Science showcase at JKUAT Juja Main Campus.',
    date: '2026-11-28T08:30:00Z',
    location: 'JKUAT Main Campus, Juja (Thika Superhighway)',
    category: 'academic',
    isFeatured: false,
  },
  {
    id: 'evt-ku-career',
    universityId: 'ku',
    universityName: 'Kenyatta University',
    title: 'Kenyatta University Career & KUCCPS Revision Week',
    description:
      'Connect with over 100 graduate employers and get guided assistance on selecting Degree and TVET courses.',
    date: '2026-12-04T09:00:00Z',
    endDate: '2026-12-05T17:00:00Z',
    location: 'KU Amphitheatre, Thika Road',
    category: 'career',
    isFeatured: false,
  },
  {
    id: 'evt-usiu-scholars',
    universityId: 'usiu',
    universityName: 'USIU-Africa',
    title: 'USIU-Africa Experience Day & Scholarship Info Session',
    description:
      'Campus tour of the USIU-Africa library, science center, and student residences, plus Q&A with the Mastercard Foundation Scholars & Financial Aid teams.',
    date: '2026-12-12T10:00:00Z',
    location: 'USIU-Africa Campus, Off Thika Road, Nairobi',
    category: 'admission',
    isFeatured: false,
  },
  {
    id: 'evt-zetech-intake',
    universityId: 'zetech',
    universityName: 'Zetech University',
    title: 'Zetech Ruiru Campus Open Day & Diploma-to-Degree Clinic',
    description:
      'Hands-on orientation for KCSE graduates with C+, C plain, and C- exploring fast-track Diploma-to-Degree pathways in IT, Software Engineering, Business, and Media.',
    date: '2027-01-09T09:00:00Z',
    location: 'Zetech Technology Park, Mang’u / Ruiru',
    category: 'admission',
    isFeatured: false,
  },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-KE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function EventsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('events').select('*').order('date', { ascending: true });

  const dbEvents = (data || []) as Event[];
  const events: Event[] = dbEvents.length > 0 ? dbEvents : FALLBACK_EVENTS;

  const featuredEvents = events.filter(e => e.isFeatured);
  const upcomingEvents = events.filter(e => !e.isFeatured);

  return (
    <>
      <div style={{ padding: '40px 20px 0' }}>
        <div style={{ position: 'relative', border: '2px solid var(--border-medium)', borderRadius: 20, boxShadow: 'var(--shadow-neo)', background: 'var(--bg-secondary)', padding: '48px 40px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px', opacity: 0.04, pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'inline-block', padding: '4px 14px', background: 'var(--gold-glow)', border: '2px solid var(--border-medium)', borderRadius: 8, boxShadow: 'var(--shadow-neo)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 16 }}>
              Campus Open Days & Clinics
            </span>
            <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 12 }}>Student Events & Open Days</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 620, lineHeight: 1.6 }}>
              Tour campuses in person, meet admissions officers, and attend KUCCPS & scholarship clinics across Kenyan universities.
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {events.length === 0 ? (
            <div style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-medium)' }}>
              <Search size={32} style={{ margin: '0 auto 16px', color: 'var(--text-tertiary)' }} />
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 8 }}>No events found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Check back later for upcoming campus events.</p>
            </div>
          ) : (
            <>
              {/* Featured Events */}
              {featuredEvents.length > 0 && (
                <div style={{ marginBottom: 60 }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                    Featured Open Days
                    <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--gold-glow)', border: '2px solid var(--border-medium)', borderRadius: 8, boxShadow: 'var(--shadow-neo)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      RSVP Open
                    </span>
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
                    {featuredEvents.map(e => (
                      <div key={e.id} className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{e.universityName}</span>
                              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-medium)' }} />
                              <span
                                style={{
                                  padding: '3px 10px',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  background: CATEGORY_CONFIG[e.category]?.bg,
                                  color: CATEGORY_CONFIG[e.category]?.color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                {CATEGORY_CONFIG[e.category]?.icon} {CATEGORY_CONFIG[e.category]?.label}
                              </span>
                            </div>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                              {e.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 800, margin: 0 }}>{e.description}</p>
                          </div>

                          <div style={{ border: '2px solid var(--border-medium)', background: 'var(--bg-secondary)', padding: '16px 24px', borderRadius: 10, textAlign: 'center', minWidth: 150 }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>
                              Event Date
                            </div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{formatDate(e.date)}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                            <MapPin size={16} style={{ color: 'var(--gold-primary)' }} /> {e.location}
                          </div>
                          <div style={{ display: 'flex', gap: 10 }}>
                            {e.registrationUrl && (
                              <a href={e.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                Event Page <ExternalLink size={14} />
                              </a>
                            )}
                            <ExpressInquiryModal
                              source="university_page"
                              universityId={e.universityId || 'uon'}
                              universityName={e.universityName}
                              defaultCourse={`Open Day RSVP: ${e.title}`}
                              triggerLabel="RSVP / Request Pass"
                              triggerClassName="btn btn-gold btn-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Events List */}
              {upcomingEvents.length > 0 && (
                <div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 24 }}>
                    Upcoming Campus Sessions
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
                    {upcomingEvents.map(e => (
                      <div key={e.id} className="card card-body" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <span
                            style={{
                              padding: '3px 10px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              background: CATEGORY_CONFIG[e.category]?.bg,
                              color: CATEGORY_CONFIG[e.category]?.color,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            {CATEGORY_CONFIG[e.category]?.icon} {CATEGORY_CONFIG[e.category]?.label}
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{e.universityName}</span>
                        </div>

                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                          {e.title}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
                          {e.description}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: 14 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontWeight: 500 }}>
                            <Calendar size={14} style={{ color: 'var(--gold-primary)' }} />
                            {formatDate(e.date)} {e.endDate && `- ${formatDate(e.endDate)}`}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-tertiary)' }}>
                            <MapPin size={14} /> {e.location}
                          </div>
                        </div>

                        <ExpressInquiryModal
                          source="university_page"
                          universityId={e.universityId || 'uon'}
                          universityName={e.universityName}
                          defaultCourse={`Open Day RSVP: ${e.title}`}
                          triggerLabel="RSVP / Enquire"
                          triggerClassName="btn btn-outline btn-sm"
                          triggerStyle={{ width: '100%', justifyContent: 'center' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
