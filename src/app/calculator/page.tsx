import type { Metadata } from 'next';
import ClusterCalculator from '@/components/ClusterCalculator';

export const metadata: Metadata = {
  title: 'KUCCPS Cluster Points Calculator | Chuo Connect Kenya',
  description: 'Easily calculate your KUCCPS Weighted Cluster Points to determine eligibility for university courses in Kenya.',
};

export default function CalculatorPage() {
  return (
    <>
      <div style={{ padding: '0 20px', marginTop: '40px' }}>
        <div style={{
          position: 'relative',
          border: '2px solid var(--border-medium)',
          borderRadius: 20,
          boxShadow: 'var(--shadow-neo)',
          background: 'var(--bg-secondary)',
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
          <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
              Cluster Points Calculator
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
              Take the guesswork out of university admissions. Instantly calculate your Weighted Cluster Points (WCP) for your desired degree programme.
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--bg-secondary)', minHeight: '60vh' }}>
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <ClusterCalculator />
          </div>
        </div>
      </section>
    </>
  );
}
