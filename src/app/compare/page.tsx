import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { University } from '@/lib/types';
import { universitiesData } from '@/lib/data/universities';
import ComparePageClient from '@/components/university/ComparePageClient';

export const metadata: Metadata = {
  title: 'Compare Kenyan Universities Side by Side',
  description: 'Compare Kenyan universities side by side. Evaluate tuition fees, academic programmes, facilities, accommodation, ratings, and KCSE cluster cutoffs.',
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
      image: u.coverUrl || u.logoUrl || u.image || '',
    })) as University[];
  }

  return (
    <div style={{ minHeight: 'calc(100svh - var(--nav-height))', paddingBottom: 88, background: 'var(--bg-primary)' }}>
      {/* Editorial Header Band */}
      <section style={{ background: 'var(--bg-secondary)', padding: 'clamp(40px, 6vw, 68px) 0' }}>
        <div className="container">
          <div className="editorial-axis-row">
            <div style={{ paddingRight: 24 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: 10 }}>
                Side-by-Side Workspace
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5, maxWidth: '30ch', margin: 0 }}>
                Compare up to three Kenyan institutions across annual tuition, hostel capacity, national ranking, and accredited facilities.
              </p>
            </div>
            <div>
              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.6rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.05em',
                  lineHeight: 0.94,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-serif)',
                  margin: 0,
                }}
              >
                Compare Campuses.
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ marginTop: 40 }}>
        <ComparePageClient initialUniversities={universities} />
      </section>
    </div>
  );
}
