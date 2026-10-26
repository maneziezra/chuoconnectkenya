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
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-secondary)',
            padding: '44px 36px',
            overflow: 'hidden',
          }}
        >
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 14px',
                background: 'var(--apple-glass-bg)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 16,
                backdropFilter: 'blur(16px)',
              }}
            >
              <GraduationCap size={13} style={{ color: 'var(--gold-primary)' }} />
              Student Funding Directory
            </span>
            <h1
              style={{
                color: 'var(--text-primary)',
                marginBottom: 12,
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
              }}
            >
              Scholarships &amp; Funding.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 640, lineHeight: 1.5 }}>
              Government HEF grants, HELB loans, and verified university scholarships.
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Interactive HEF Band 1-5 Simulator Callout */}
          <div
            style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
              borderTop: '1px solid var(--apple-glass-highlight)',
              padding: '28px 32px',
              marginBottom: 36,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold-primary)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 6 }}>
                <Wallet size={15} /> HEF Funding Model
              </div>
              <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 6 }}>
                Estimate Your HEF Band &amp; Household Tuition
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                Check your exact scholarship percentage and out-of-pocket family fee before applying.
              </p>
            </div>
            <Link href="/calculator" className="btn btn-gold" style={{ borderRadius: 'var(--radius-md)' }}>
              <Calculator size={16} /> Open HEF Simulator
            </Link>
          </div>

          {/* Category Filters & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['All', ...Object.keys(CATEGORY_LABELS)].map(cat => {
                const isActive = (category || 'All') === cat;
                return (
                  <Link
                    key={cat}
                    href={`/scholarships${cat === 'All' ? '' : `?category=${cat}`}`}
                    style={{
                      padding: '7px 18px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-light)',
                      borderTop: '1px solid var(--apple-glass-highlight)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all var(--apple-ease)',
                      background: isActive ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                      color: isActive ? 'var(--gold-contrast-text)' : 'var(--text-primary)',
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
                style={{ padding: '8px 14px', fontSize: '0.85rem', borderRadius: 'var(--radius-md)' }}
              />
              <button type="submit" className="btn btn-gold btn-sm" style={{ borderRadius: 'var(--radius-md)' }}>
                <Search size={14} /> Search
              </button>
            </form>
          </div>

          {scholarships.length === 0 ? (
            <div style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-medium)' }}>
              <Search size={32} style={{ margin: '0 auto 16px', color: 'var(--text-tertiary)' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No scholarships found</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>We couldn&apos;t find any scholarships matching your filter.</p>
              <Link href="/scholarships" className="btn btn-outline btn-sm" style={{ borderRadius: 'var(--radius-md)' }}>Reset Filters</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {scholarships.map(s => {
                const catStyle = CATEGORY_COLORS[s.category] ?? { bg: 'var(--bg-secondary)', color: 'var(--text-secondary)' };
                return (
                  <div
                    key={s.id}
                    className="card card-body"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--border-light)',
                      borderTop: '1px solid var(--apple-glass-highlight)',
                      padding: 24,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--border-light)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: catStyle.bg,
                          color: catStyle.color,
                        }}
                      >
                        {CATEGORY_LABELS[s.category] || s.category}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                        <Calendar size={13} /> Deadline: {new Date(s.deadline).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.12rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)',
                        marginBottom: 4,
                        lineHeight: 1.3,
                      }}
                    >
                      {s.title}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: 12 }}>
                      by <strong style={{ color: 'var(--text-secondary)' }}>{s.provider}</strong>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '9px 14px',
                        background: 'var(--gold-glow)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        marginBottom: 14,
                      }}
                    >
                      <GraduationCap size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.amount}</span>
                    </div>

                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1, margin: 0 }}>
                      {s.description}
                    </p>

                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 12, lineHeight: 1.5 }}>
                        <strong>Eligibility:</strong> {s.eligibility}
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {s.applicationUrl && (
                          <a
                            href={s.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', borderRadius: 'var(--radius-md)' }}
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
          <div
            style={{
              marginTop: 60,
              padding: '48px 36px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
              borderTop: '1px solid var(--apple-glass-highlight)',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: 'var(--text-primary)',
                  marginBottom: 12,
                }}
              >
                Represent a University Financial Aid Office or Foundation?
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.95rem', lineHeight: 1.6 }}>
                List your 2026 scholarship or bursary fund on Chuo Connect to reach qualified KCSE candidates nationwide.
              </p>
              <Link href="/contact" className="btn btn-gold" style={{ borderRadius: 'var(--radius-md)' }}>Submit a Scholarship</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

