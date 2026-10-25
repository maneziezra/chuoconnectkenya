import type { Metadata } from 'next';
import KuccpsCalculator from '@/components/student/KuccpsCalculator';
import { createClient } from '@/lib/supabase/server';
import type { Course, University } from '@/lib/types';

export const metadata: Metadata = {
  title: 'KUCCPS Cluster Points & HEF Funding Calculator',
  description:
    'Calculate your official KUCCPS Weighted Cluster Points across all 20 subject clusters, simulate your HEF Band 1–5 Government Scholarship & HELB Loan, and build your 6-slot KUCCPS choice basket.',
};

export default async function CalculatorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    profile = data;
  }

  const { data: coursesData } = await supabase.from('courses').select('*');
  const { data: universitiesData } = await supabase.from('universities').select('id, name, abbrev');

  const courses = (coursesData || []) as Course[];
  const universities = (universitiesData || []) as University[];

  return (
    <div style={{ minHeight: 'calc(100svh - var(--nav-height))', paddingBottom: 88, background: 'var(--bg-primary)' }}>
      {/* Editorial Workspace Header */}
      <section style={{ background: 'var(--bg-secondary)', padding: '28px 0' }}>
        <div className="container">
          <div className="editorial-axis-row" style={{ alignItems: 'center' }}>
            <div style={{ paddingRight: 24 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.5, maxWidth: '34ch', margin: 0 }}>
                Compute your official 48-point weighted cluster score across all 20 KUCCPS clusters and simulate out-of-pocket fees under HEF Bands 1 to 5.
              </p>
            </div>
            <div>
              <h1
                style={{
                  fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.08,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-serif)',
                  margin: 0,
                }}
              >
                Cluster &amp; HEF Simulator.
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ marginTop: 28 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <KuccpsCalculator
            courses={courses}
            universities={universities}
            initialProfile={profile}
            userId={user?.id}
          />
        </div>
      </section>
    </div>
  );
}
