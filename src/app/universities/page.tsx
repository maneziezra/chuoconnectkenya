import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { University } from '@/lib/types';
import { universitiesData } from '@/lib/data/universities';
import UniversityBrowser from '@/components/university/UniversityBrowser';

export const metadata: Metadata = {
  title: 'Directory of Accredited Kenyan Universities & TVETs',
  description:
    'Browse and compare 68 accredited Kenyan public and private universities, national polytechnics, and TVET colleges across all 47 counties.',
};

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ county?: string; q?: string; type?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let userHighSchool = null;
  if (user) {
    const { data: profile } = await supabase.from('student_profiles').select('high_school').eq('user_id', user.id).single();
    if (profile?.high_school) userHighSchool = profile.high_school;
  }

  const { data } = await supabase.from('universities').select('*').order('ranking', { ascending: true });
  const dbIds = new Set((data || []).map((u: any) => u.id));
  const mergedUnis = [
    ...(data || []),
    ...universitiesData.filter(u => !dbIds.has(u.id))
  ].sort((a: any, b: any) => (a.ranking ?? 99) - (b.ranking ?? 99));

  const universities = mergedUnis.map((u: any) => ({
    ...u,
    image: u.coverUrl || u.logoUrl || u.image || '',
  })) as University[];

  return (
    <div style={{ minHeight: 'calc(100svh - var(--nav-height))', paddingBottom: 88, background: 'var(--bg-primary)' }}>
      {/* Editorial Report Masthead Band */}
      <section
        style={{
          background: 'var(--bg-secondary)',
          padding: 'clamp(32px, 5vw, 56px) 0',
        }}
      >
        <div className="container">
          <div className="editorial-axis-row">
            {/* Left Margin Standfirst */}
            <div style={{ paddingRight: 24 }}>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  maxWidth: '34ch',
                  margin: 0,
                }}
              >
                Every chartered public university, private institution, and national technical polytechnic in Kenya indexed by county, tuition band, and student rating.
              </p>
            </div>

            {/* 42% Vertical Axis Display Title */}
            <div className="editorial-hero-title-col">
              <h1
                style={{
                  fontSize: 'clamp(1.625rem, 2.2vw, 2rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.04,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 14px 0',
                }}
              >
                <span className="tabular-nums">{universities.length}</span> Accredited Campuses.
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span><strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>35</strong> Public Chartered</span>
                <span><strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>21</strong> Private Chartered</span>
                <span><strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>12</strong> National Polytechnics &amp; TVET</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ marginTop: 32 }}>
        <UniversityBrowser
          universities={universities}
          userHighSchool={userHighSchool}
          initialCounty={params.county}
          initialQuery={params.q}
          initialType={params.type}
        />
      </section>
    </div>
  );
}
