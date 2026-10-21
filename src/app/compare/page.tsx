import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { University } from '@/lib/types';
import { universitiesData } from '@/lib/data/universities';
import ComparePageClient from '@/components/university/ComparePageClient';
import { Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Universities Side-by-Side',
  description: 'Compare Kenyan universities side-by-side. Evaluate tuition fees, academic programmes, facilities, accommodation, ratings, and KCSE cluster cutoffs.',
};

interface Props {
  searchParams: Promise<{ ids?: string }>;
}

export default async function ComparePage({ searchParams }: Props) {
  const { ids } = await searchParams;
  const idList = ids ? ids.split(',').slice(0, 3) : [];

  let universities: University[] = [];
  if (idList.length > 0) {
    const supabase = await createClient();
    const { data } = await supabase.from('universities').select('*').in('id', idList);
    const dbUnis = data || [];
    const seen = new Set(dbUnis.map((u: any) => u.id));
    const localMatches = universitiesData.filter(u => idList.includes(u.id) && !seen.has(u.id));
    universities = [...dbUnis, ...localMatches].map((u: any) => ({
      ...u,
      image: u.coverUrl || u.logoUrl || u.image || '/images/universities/uon.jpg'
    })) as University[];
  }

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-height))', paddingBottom: 80 }}>
      {/* Hero Banner with Apple Glass Squircle */}
      <div style={{ padding: '0 20px', marginTop: '28px', maxWidth: '1400px', margin: '28px auto 0' }}>
        <div
          style={{
            position: 'relative',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 10px 30px rgba(0,0,0,0.04)',
            background: 'var(--bg-secondary)',
            padding: '44px 36px',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Radial Lighting */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 500,
              height: 260,
              background: 'radial-gradient(circle at 100% 0%, var(--gold-glow), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              backgroundImage: 'radial-gradient(circle, var(--text-primary) 0.75px, transparent 0.75px)',
              backgroundSize: '24px 24px',
              opacity: 0.035,
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 680 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
                marginBottom: 16,
              }}
            >
              <Scale size={13} style={{ color: 'var(--accent-gold)' }} />
              Side-by-Side Comparison
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.028em',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 12px 0',
              }}
            >
              Compare Campuses
            </h1>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.98rem',
                lineHeight: 1.55,
                margin: 0,
                fontFamily: 'var(--font-sans)',
              }}
            >
              Evaluate Kenyan institutions side-by-side across annual tuition fees, academic programmes, student life, verified accommodation, and national rankings.
            </p>
          </div>
        </div>
      </div>

      <section style={{ maxWidth: '1400px', margin: '32px auto 0', padding: '0 20px' }}>
        <ComparePageClient initialUniversities={universities} />
      </section>
    </div>
  );
}
