import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { University } from '@/lib/types';
import ComparePageClient from '@/components/university/ComparePageClient';

export const metadata: Metadata = {
  title: 'Compare Universities | Chuo Connect Kenya',
  description: 'Compare universities side-by-side. Evaluate tuition fees, academic programmes, facilities, accommodation, ratings and more.',
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
    universities = (data || []).map((u: any) => ({
      ...u,
      image: u.coverUrl || u.logoUrl || u.image || '/images/universities/uon.jpg'
    })) as University[];
  }

  return (
    <>
      <div style={{ padding: '0 20px', marginTop: '40px' }}>
        <div style={{
          position: 'relative',
          border: '2px solid var(--navy-deep)',
          borderRadius: 20,
          boxShadow: '4px 4px 0px var(--navy-deep)',
          background: '#FAFAF8',
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
            <span style={{ display: 'inline-block', padding: '4px 14px', background: 'var(--gold-glow)', border: '2px solid var(--navy-deep)', borderRadius: 8, boxShadow: '2px 2px 0px var(--navy-deep)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--navy-deep)', marginBottom: 16 }}>
              Side-by-Side
            </span>
            <h1 className="text-h1" style={{ color: 'var(--navy-deep)', marginBottom: 12 }}>Compare Campuses</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560 }}>
              Evaluate institutions side-by-side across fees, programmes, facilities, ratings, and student life.
            </p>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <ComparePageClient initialUniversities={universities} />
        </div>
      </section>
    </>
  );
}
