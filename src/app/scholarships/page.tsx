import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, ExternalLink, Calendar, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { Scholarship } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Scholarships in Kenya | Chuo Connect Kenya',
  description: 'Discover scholarship opportunities for Kenyan students — government bursaries, private scholarships, and international funding.',
};

const CATEGORY_LABELS: Record<string, string> = {
  government: 'Government', private: 'Private', institutional: 'Institutional', international: 'International',
};
const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  government: { bg: 'var(--navy-light)', color: 'var(--text-primary)' },
  private: { bg: 'var(--gold-glow)', color: 'var(--gold-primary)' },
  institutional: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  international: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ScholarshipsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  
  const supabase = await createClient();
  let query = supabase.from('scholarships').select('*').order('createdAt', { ascending: false });
  
  if (category && category !== 'All' && CATEGORY_LABELS[category]) {
    query = query.eq('category', category);
  }

  const { data: { user } } = await supabase.auth.getUser();
  let userCounty = null;
  if (user) {
    const { data: profile } = await supabase.from('student_profiles').select('county').eq('user_id', user.id).single();
    if (profile?.county) userCounty = profile.county;
  }

  const { data, error } = await query;
  const scholarships = (data || []) as Scholarship[];
  const isError = !!error && error.code !== '42P01'; // Ignore relation does not exist yet

  let countyScholarships: Scholarship[] = [];
  if (userCounty) {
    countyScholarships = scholarships.filter(s => 
      s.title.toLowerCase().includes(userCounty.toLowerCase()) || 
      s.eligibility.toLowerCase().includes(userCounty.toLowerCase()) ||
      s.description.toLowerCase().includes(userCounty.toLowerCase())
    );
  }

  return (
    <>
      <div style={{ padding: '0 20px', marginTop: '40px' }}>
        <div style={{
          position: 'relative',
          border: '2px solid var(--border-medium)',
          borderRadius: 20,
          boxShadow: 'var(--shadow-neo)',
          background: 'var(--bg-secondary)',
          padding: '48px 40px',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
            opacity: 0.04,
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none'
          }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'inline-block', padding: '4px 14px', background: 'var(--gold-glow)', border: '2px solid var(--border-medium)', borderRadius: 8, boxShadow: 'var(--shadow-neo)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 16 }}>
              Funding Opportunities
            </span>
            <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 12 }}>Scholarships & Bursaries</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560 }}>
              Discover funding opportunities to support your higher education journey in Kenya and abroad.
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Category Filters */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
            {['All', ...Object.keys(CATEGORY_LABELS)].map(cat => {
              const isActive = (category || 'All') === cat;
              return (
                <Link
                  key={cat}
                  href={`/scholarships${cat === 'All' ? '' : `?category=${cat}`}`}
                  style={{
                    padding: '6px 16px', borderRadius: 8,
                    border: '2px solid var(--border-medium)', fontSize: '0.85rem', fontWeight: 600,
                    textDecoration: 'none', transition: 'all 0.2s',
                    background: isActive ? 'var(--gold-glow)' : 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    boxShadow: isActive ? '2px 2px 0px var(--navy-deep)' : 'none',
                    transform: isActive ? 'translate(-2px, -2px)' : 'none',
                  }}
                >
                  {cat === 'All' ? 'All Types' : CATEGORY_LABELS[cat]}
                </Link>
              );
            })}
          </div>

          {userCounty && (
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, background: 'var(--gold-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
                  <Search size={20} />
                </div>
                <div>
                  <h2 className="text-h2" style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: 4 }}>
                    Matches for {userCounty} County
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Based on your profile, here are local opportunities.
                  </p>
                </div>
              </div>
              
              {countyScholarships.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
                  {countyScholarships.map(s => {
                    const catStyle = CATEGORY_COLORS[s.category] ?? { bg: 'var(--bg-secondary)', color: 'var(--text-secondary)' };
                    return (
                      <div key={`county-${s.id}`} className="card card-body" style={{ display: 'flex', flexDirection: 'column', border: '2px solid var(--gold-primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <span style={{ padding: '3px 10px', borderRadius: 8, border: '2px solid var(--border-medium)', boxShadow: 'var(--shadow-neo)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', background: catStyle.bg, color: catStyle.color }}>
                            {CATEGORY_LABELS[s.category]}
                          </span>
                        </div>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{s.title}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, flex: 1 }}>{s.description}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-medium)' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>We are actively looking for more bursaries specific to {userCounty} County. Check back soon!</p>
                </div>
              )}
            </div>
          )}

          {isError ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--danger-bg)', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ color: 'var(--danger-text)' }}>Failed to load scholarships. Please try again later.</p>
            </div>
          ) : scholarships.length === 0 ? (
            <div style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-medium)' }}>
              <Search size={32} style={{ margin: '0 auto 16px', color: 'var(--text-tertiary)' }} />
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 8 }}>No scholarships found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>We couldn't find any scholarships matching your criteria.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {scholarships.map(s => {
                const catStyle = CATEGORY_COLORS[s.category] ?? { bg: 'var(--bg-secondary)', color: 'var(--text-secondary)' };
                return (
                  <div key={s.id} className="card card-body" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <span style={{ padding: '3px 10px', borderRadius: 8, border: '2px solid var(--border-medium)', boxShadow: 'var(--shadow-neo)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', background: catStyle.bg, color: catStyle.color }}>
                        {CATEGORY_LABELS[s.category]}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                        <Calendar size={12} /> {new Date(s.deadline).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{s.title}</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: 10 }}>by {s.provider}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--gold-glow)', borderRadius: 'var(--radius-md)', marginBottom: 12 }}>
                      <GraduationCap size={14} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.amount}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, flex: 1 }}>{s.description}</p>
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 10 }}>
                        <strong>Eligibility:</strong> {s.eligibility}
                      </div>
                      {s.applicationUrl && (
                        <a href={s.applicationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-navy btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'center' }}>
                          Apply Now <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div style={{ marginTop: 60, padding: '40px', background: 'var(--bg-secondary)', borderRadius: 16, border: '2px solid var(--border-medium)', boxShadow: 'var(--shadow-neo)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
              backgroundSize: '28px 28px',
              opacity: 0.04,
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)', marginBottom: 12 }}>Know a scholarship not listed here?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Help us grow our database for future students.</p>
              <Link href="/contact" className="btn btn-navy">Submit a Scholarship</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
