import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, ExternalLink, Calendar, Search, Wallet, Calculator } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { FALLBACK_SCHOLARSHIPS, type EnrichedScholarship } from '@/lib/data/scholarships';
import ExpressInquiryModal from '@/components/university/ExpressInquiryModal';

export const metadata: Metadata = {
  title: 'Scholarships, HEF Grants & HELB Loans in Kenya (2026)',
  description:
    'Discover 2026 Kenyan scholarships, HEF Band 1–5 Government Grants, HELB Tuition & Upkeep Loans, Mastercard Foundation, Equity Leaders, and institutional university bursaries.',
};

const CATEGORY_LABELS: Record<string, string> = {
  government: 'Government & HEF',
  private: 'Corporate & Foundations',
  institutional: 'University Merit Aid',
  international: 'International & Full-Ride',
};

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  government: { bg: 'var(--navy-light)', color: 'var(--text-primary)' },
  private: { bg: 'var(--gold-glow)', color: 'var(--gold-primary)' },
  institutional: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  international: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
};

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ScholarshipsPage({ searchParams }: Props) {
  const { category, q } = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase
    .from('scholarships')
    .select('*')
    .order('createdAt', { ascending: false });

  // Merge DB rows with curated fallback scholarships so the directory is always populated
  const dbRows = (data || []) as EnrichedScholarship[];
  const mergedMap = new Map<string, EnrichedScholarship>();
  for (const s of FALLBACK_SCHOLARSHIPS) {
    mergedMap.set(s.title.toLowerCase(), s);
  }
  for (const s of dbRows) {
    mergedMap.set(s.title.toLowerCase(), s);
  }

  let scholarships = Array.from(mergedMap.values());

  if (category && category !== 'All' && CATEGORY_LABELS[category]) {
    scholarships = scholarships.filter(s => s.category === category);
  }
  if (q && q.trim()) {
    const queryLower = q.trim().toLowerCase();
    scholarships = scholarships.filter(
      s =>
        s.title.toLowerCase().includes(queryLower) ||
        s.provider.toLowerCase().includes(queryLower) ||
        s.description.toLowerCase().includes(queryLower) ||
        s.eligibility.toLowerCase().includes(queryLower)
    );
  }

  return (
    <>
      <div style={{ padding: '0 20px', marginTop: '40px' }}>
        <div
          style={{
            position: 'relative',
            border: '2px solid var(--border-medium)',
            borderRadius: 20,
            boxShadow: 'var(--shadow-neo)',
            background: 'var(--bg-secondary)',
            padding: '48px 40px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
              backgroundSize: '28px 28px',
              opacity: 0.04,
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 14px',
                background: 'var(--gold-glow)',
                border: '2px solid var(--border-medium)',
                borderRadius: 8,
                boxShadow: 'var(--shadow-neo)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                marginBottom: 16,
              }}
            >
              2026 Student Funding Hub
            </span>
            <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 12 }}>
              Scholarships, HEF Grants & Bursaries
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 640, lineHeight: 1.6 }}>
              Explore verified Government HEF Band 1–5 scholarships, HELB loans, corporate foundations, and direct university merit waivers for Kenyan students.
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Interactive HEF Band 1-5 Simulator Callout */}
          <div
            style={{
              background: 'var(--navy-deep)',
              borderRadius: 18,
              padding: '24px 28px',
              color: '#FFFFFF',
              marginBottom: 32,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 18,
              boxShadow: 'var(--shadow-neo)',
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold-primary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                <Wallet size={15} /> Means Testing Instrument (Bands 1–5)
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
                Estimate Your Government HEF Scholarship % & HELB Upkeep Stipend
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.88rem', margin: 0, lineHeight: 1.55 }}>
                Find out whether you fall into Band 1 (70% Free Gov Scholarship + KES 60k Upkeep) through Band 5 and see your exact per-semester household fee before applying.
              </p>
            </div>
            <Link href="/calculator" className="btn btn-gold">
              <Calculator size={16} /> Open HEF Fee Simulator
            </Link>
          </div>

          {/* Category Filters & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['All', ...Object.keys(CATEGORY_LABELS)].map(cat => {
                const isActive = (category || 'All') === cat;
                return (
                  <Link
                    key={cat}
                    href={`/scholarships${cat === 'All' ? '' : `?category=${cat}`}`}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 8,
                      border: '2px solid var(--border-medium)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      background: isActive ? 'var(--gold-glow)' : 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      boxShadow: isActive ? '2px 2px 0px var(--navy-deep)' : 'none',
                      transform: isActive ? 'translate(-2px, -2px)' : 'none',
                    }}
                  >
                    {cat === 'All' ? 'All Funding' : CATEGORY_LABELS[cat]}
                  </Link>
                );
              })}
            </div>

            <form action="/scholarships" method="GET" style={{ display: 'flex', gap: 8, minWidth: 260 }}>
              {category && <input type="hidden" name="category" value={category} />}
              <input
                type="search"
                name="q"
                defaultValue={q || ''}
                placeholder="Search HELB, Equity, USIU..."
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-navy btn-sm">
                Search
              </button>
            </form>
          </div>

          {scholarships.length === 0 ? (
            <div style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-medium)' }}>
              <Search size={32} style={{ margin: '0 auto 16px', color: 'var(--text-tertiary)' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 8 }}>No scholarships found</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>We couldn&apos;t find any scholarships matching your filter.</p>
              <Link href="/scholarships" className="btn btn-outline btn-sm">Reset Filters</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {scholarships.map(s => {
                const catStyle = CATEGORY_COLORS[s.category] ?? { bg: 'var(--bg-secondary)', color: 'var(--text-secondary)' };
                return (
                  <div key={s.id} className="card card-body" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 8,
                          border: '2px solid var(--border-medium)',
                          boxShadow: 'var(--shadow-neo)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          background: catStyle.bg,
                          color: catStyle.color,
                        }}
                      >
                        {CATEGORY_LABELS[s.category] || s.category}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                        <Calendar size={12} /> Deadline: {new Date(s.deadline).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>
                      {s.title}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: 10 }}>
                      by <strong>{s.provider}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--gold-glow)', borderRadius: 'var(--radius-md)', marginBottom: 12 }}>
                      <GraduationCap size={15} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.amount}</span>
                    </div>

                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1 }}>
                      {s.description}
                    </p>

                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 12, lineHeight: 1.5 }}>
                        <strong>Eligibility:</strong> {s.eligibility}
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {s.applicationUrl && (
                          <a
                            href={s.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-navy btn-sm"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}
                          >
                            Official Portal <ExternalLink size={13} />
                          </a>
                        )}
                        {s.partnerUniversityId && s.partnerUniversityName && (
                          <ExpressInquiryModal
                            source="university_page"
                            universityId={s.partnerUniversityId}
                            universityName={s.partnerUniversityName}
                            defaultCourse={`Scholarship Inquiry: ${s.title}`}
                            triggerLabel="Enquire via Chuo Connect"
                            triggerClassName="btn btn-gold btn-sm"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div style={{ marginTop: 60, padding: '40px', background: 'var(--bg-secondary)', borderRadius: 16, border: '2px solid var(--border-medium)', boxShadow: 'var(--shadow-neo)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: 12 }}>
                Represent a University Financial Aid Office or Foundation?
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                List your 2026 scholarship or bursary fund on Chuo Connect to reach qualified KCSE candidates nationwide.
              </p>
              <Link href="/contact" className="btn btn-navy">Submit a Scholarship</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
