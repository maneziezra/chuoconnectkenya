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
    <div style={{ minHeight: 'calc(100svh - var(--nav-height))', paddingBottom: 'clamp(64px, 8vw, 112px)', background: 'var(--bg-primary)' }}>
      {/* Apple-Style Minimal Stage Header */}
      <section style={{ padding: 'clamp(20px, 2.5vw, 32px) 0 clamp(12px, 1.5vw, 18px)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ maxWidth: 760 }}>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.35rem, 2vw, 1.85rem)',
                fontWeight: 400,
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                margin: 0,
                marginBottom: 'var(--sk-headline-plus-first-element-margin, 0.4em)',
              }}
            >
              Cluster &amp; HEF Simulator.
            </h1>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Official 48-point KUCCPS cluster scores, HEF Band 1–5 tuition estimates, and your 6-choice placement basket.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Stage */}
      <main className="container" style={{ marginTop: 'clamp(16px, 2vw, 24px)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <KuccpsCalculator
            courses={courses}
            universities={universities}
            initialProfile={profile}
            userId={user?.id}
          />
        </div>
      </main>
    </div>
  );
}
