import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { University } from '@/lib/types';
import { universitiesData } from '@/lib/data/universities';
import UniversityBrowser from '@/components/university/UniversityBrowser';
import { GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Explore Universities in Kenya',
  description:
    'Browse and compare all accredited universities and colleges in Kenya. Filter by county, type, ranking, fees, facilities, accommodation and more.',
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
    image: u.coverUrl || u.logoUrl || u.image || '/images/universities/uon.jpg' 
  })) as University[];

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-height))', paddingBottom: 80 }}>
      {/* Hero Header with Apple Glass Squircle */}
      <div style={{ padding: '0 20px', marginTop: '28px', maxWidth: '1400px', margin: '28px auto 0' }}>
        <div
          style={{
            position: 'relative',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 10px 30px rgba(0,0,0,0.03)',
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

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 740 }}>
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
              <GraduationCap size={13} style={{ color: 'var(--accent-gold)' }} />
              Directory of Accredited Institutions
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
              Explore Campuses Across Kenya
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
              Discover <strong style={{ color: 'var(--accent-gold)' }}>{universities.length}</strong> accredited Kenyan institutions. Filter by county, type, ranking, fees, facilities, and verified student reviews.
            </p>
          </div>
        </div>
      </div>

      <section style={{ maxWidth: '1400px', margin: '32px auto 0', padding: '0 20px' }}>
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
