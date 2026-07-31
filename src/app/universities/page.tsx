import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { University } from '@/lib/types';
import UniversityBrowser from '@/components/university/UniversityBrowser';

export const metadata: Metadata = {
  title: 'Explore Universities in Kenya | Chuo Connect Kenya',
  description:
    'Browse and compare all accredited universities and colleges in Kenya. Filter by county, type, ranking, fees, facilities, accommodation and more.',
};

export default async function UniversitiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let userHighSchool = null;
  if (user) {
    const { data: profile } = await supabase.from('student_profiles').select('high_school').eq('user_id', user.id).single();
    if (profile?.high_school) userHighSchool = profile.high_school;
  }
  
  const { data } = await supabase.from('universities').select('*').order('ranking', { ascending: true });
  const universities = (data || []).map((u: any) => ({ 
    ...u, 
    image: u.coverUrl || u.logoUrl || u.image || '/images/universities/uon.jpg' 
  })) as University[];

  return (
    <>
      {/* Page Header */}
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
            <span style={{
              display: 'inline-block', padding: '4px 14px', background: 'var(--gold-glow)',
              border: '2px solid var(--navy-deep)', borderRadius: 8,
              boxShadow: '2px 2px 0px var(--navy-deep)',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--navy-deep)', marginBottom: 16,
            }}>
              Complete Directory
            </span>
            <h1 className="text-h1" style={{ color: 'var(--navy-deep)', marginBottom: 12 }}>Explore Campuses Across Kenya</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560 }}>
              Discover{' '}
              <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{universities.length}</span>{' '}
              accredited institutions. Filter, compare, and find your perfect campus match.
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <UniversityBrowser universities={universities} userHighSchool={userHighSchool} />
        </div>
      </section>
    </>
  );
}
