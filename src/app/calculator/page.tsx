import type { Metadata } from 'next';
import KuccpsCalculator from '@/components/student/KuccpsCalculator';
import { createClient } from '@/lib/supabase/server';
import type { Course, University } from '@/lib/types';

export const metadata: Metadata = {
  title: 'KUCCPS Cluster Points & HEF Funding Calculator',
  description:
    'Calculate your official KUCCPS Weighted Cluster Points across all 8 subject clusters, simulate your HEF Band 1–5 Government Scholarship & HELB Loan, and build your 6-slot KUCCPS choice basket.',
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
          <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <span className="badge badge-gold" style={{ marginBottom: 14 }}>
              2025/2026 Placement & HEF Band Suite
            </span>
            <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
              KUCCPS Cluster & HEF Band Simulator
            </h1>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                maxWidth: 680,
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Calculate your exact Weighted Cluster Points across 8 official clusters, estimate your family&apos;s out-of-pocket fees under HEF Bands 1–5, and build your 6-slot KUCCPS revision basket.
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--bg-secondary)', minHeight: '60vh' }}>
        <div className="container">
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <KuccpsCalculator
              courses={courses}
              universities={universities}
              initialProfile={profile}
              userId={user?.id}
            />
          </div>
        </div>
      </section>
    </>
  );
}
