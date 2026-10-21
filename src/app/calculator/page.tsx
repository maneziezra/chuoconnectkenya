import type { Metadata } from 'next';
import KuccpsCalculator from '@/components/student/KuccpsCalculator';
import { createClient } from '@/lib/supabase/server';
import type { Course, University } from '@/lib/types';
import { Calculator } from 'lucide-react';

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
            padding: '48px 36px',
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

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                marginBottom: 16,
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
              }}
            >
              <Calculator size={13} style={{ color: 'var(--accent-gold)' }} />
              2025/2026 KUCCPS & HEF Band Intelligence
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)',
                fontWeight: 700,
                letterSpacing: '-0.028em',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 14px 0',
              }}
            >
              KUCCPS Cluster & HEF Band Simulator
            </h1>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.6,
                margin: 0,
                fontFamily: 'var(--font-sans)',
              }}
            >
              Calculate your exact Weighted Cluster Points across all 8 clusters, estimate out-of-pocket tuition under HEF Bands 1–5, and build your 6-slot KUCCPS revision basket.
            </p>
          </div>
        </div>
      </div>

      <section style={{ maxWidth: '1400px', margin: '36px auto 0', padding: '0 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
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
