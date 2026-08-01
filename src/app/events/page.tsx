import type { Metadata } from 'next';
import { Calendar, MapPin, ExternalLink, Search, BookOpen, Trophy, Globe, Briefcase, PartyPopper, GraduationCap } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { Event } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Campus Events | Chuo Connect Kenya',
  description: 'Discover upcoming campus events, open days, career fairs, and student activities at universities across Kenya.'};

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  academic: { label: 'Academic', color: '#1D4ED8', bg: '#DBEAFE', icon: <BookOpen size={14} /> },
  sports: { label: 'Sports', color: 'var(--success-text)', bg: 'var(--success-bg)', icon: <Trophy size={14} /> },
  cultural: { label: 'Cultural', color: '#7C3AED', bg: '#EDE9FE', icon: <Globe size={14} /> },
  career: { label: 'Career', color: '#B45309', bg: 'var(--warning-bg)', icon: <Briefcase size={14} /> },
  social: { label: 'Social', color: '#DB2777', bg: '#FCE7F3', icon: <PartyPopper size={14} /> },
  admission: { label: 'Open Day', color: '#C79B37', bg: 'rgba(199,155,55,0.15)', icon: <GraduationCap size={14} /> }};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-KE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function EventsPage() {
  const supabase = await createClient();
  
  // Fetch events
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
  
  const events = (data || []) as Event[];
  const isError = !!error && error.code !== '42P01';

  const today = new Date();
  
  const featuredEvents = events.filter(e => e.isFeatured && new Date(e.date) >= today);
  const upcomingEvents = events.filter(e => !e.isFeatured && new Date(e.date) >= today);
  const pastEvents = events.filter(e => new Date(e.date) < today);

  return (
    <>
      <div style={{ padding: '40px 20px 0' }}>
        <div style={{ position: 'relative', border: '2px solid var(--border-medium)', borderRadius: 20, boxShadow: 'var(--shadow-neo)', background: 'var(--bg-secondary)', padding: '48px 40px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px', opacity: 0.04, pointerEvents: 'none' }}></div>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'inline-block', padding: '4px 14px', background: 'var(--gold-glow)', border: '2px solid var(--border-medium)', borderRadius: 8, boxShadow: 'var(--shadow-neo)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-primary)', marginBottom: 16 }}>
              Campus Life
            </span>
            <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 12 }}>Student Events</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560 }}>
              Don't miss out on open days, career fairs, cultural weeks, and more happening across Kenyan universities.
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          
          {isError ? (
             <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--danger-bg)', borderRadius: 'var(--radius-lg)' }}>
               <p style={{ color: 'var(--danger-text)' }}>Failed to load events. Please try again later.</p>
             </div>
          ) : events.length === 0 ? (
             <div style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-medium)' }}>
               <Search size={32} style={{ margin: '0 auto 16px', color: 'var(--text-tertiary)' }} />
               <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 8 }}>No events found</h3>
               <p style={{ color: 'var(--text-secondary)' }}>Check back later for exciting campus events.</p>
             </div>
          ) : (
            <>
              {/* Featured Events */}
              {featuredEvents.length > 0 && (
                <div style={{ marginBottom: 60 }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                    Featured Events
                    <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--gold-glow)', border: '2px solid var(--border-medium)', borderRadius: 8, boxShadow: 'var(--shadow-neo)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Don't Miss</span>
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
                    {featuredEvents.map(e => (
                      <div key={e.id} className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{e.universityName}</span>
                              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-medium)' }}></span>
                              <span style={{ 
                                padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' as const, 
                                background: CATEGORY_CONFIG[e.category]?.bg, color: CATEGORY_CONFIG[e.category]?.color, display: 'flex', alignItems: 'center', gap: 4 
                              }}>
                                {CATEGORY_CONFIG[e.category]?.icon} {CATEGORY_CONFIG[e.category]?.label}
                              </span>
                            </div>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{e.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 800 }}>{e.description}</p>
                          </div>
                          
                          <div style={{ border: '2px solid var(--border-medium)', background: 'var(--bg-secondary)', padding: '16px 24px', borderRadius: 10, textAlign: 'center', minWidth: 140 }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' as const, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>Date</div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatDate(e.date)}</div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                            <MapPin size={16} style={{ color: 'var(--navy-light)' }}/> {e.location}
                          </div>
                          {e.registrationUrl && (
                            <a href={e.registrationUrl} className="btn btn-navy btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              Register <ExternalLink size={14}/>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Events List */}
              {upcomingEvents.length > 0 && (
                <div style={{ marginBottom: 60 }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 24 }}>Upcoming Events</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
                    {upcomingEvents.map(e => (
                      <div key={e.id} className="card card-body" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <span style={{ 
                                padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' as const, 
                                background: CATEGORY_CONFIG[e.category]?.bg, color: CATEGORY_CONFIG[e.category]?.color 
                          }}>
                             {CATEGORY_CONFIG[e.category]?.icon} {CATEGORY_CONFIG[e.category]?.label}
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{e.universityName}</span>
                        </div>
                        
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{e.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: 16 }}>{e.description}</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontWeight: 500 }}>
                            <Calendar size={14} style={{ color: 'var(--gold-primary)' }}/>
                            {formatDate(e.date)} {e.endDate && `- ${formatDate(e.endDate)}`}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-tertiary)' }}>
                            <MapPin size={14} /> {e.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 24, opacity: 0.6 }}>Past Events</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
                    {pastEvents.map(e => (
                      <div key={e.id} className="card card-body" style={{ opacity: 0.7, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <span style={{ 
                                padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' as const, 
                                background: 'var(--bg-secondary)', color: 'var(--text-tertiary)' 
                          }}>
                             {CATEGORY_CONFIG[e.category]?.icon} {CATEGORY_CONFIG[e.category]?.label}
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{e.universityName}</span>
                        </div>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{e.title}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Calendar size={14} /> {formatDate(e.date)}
                          </div>
                        </div>
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
