export const metadata = {
  title: 'Terms of Service & User Agreement',
  description: 'Terms of Service and User Agreement for Chuo Connect Kenya',
};

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '80vh', padding: '48px 20px 80px' }}>
      <div
        className="container"
        style={{
          maxWidth: 840,
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          borderTop: '1px solid var(--apple-glass-highlight)',
          boxShadow: '0 20px 48px -12px rgba(26, 35, 56, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
          padding: '48px 40px',
        }}
      >
        <div style={{ marginBottom: 32, borderBottom: '1px solid var(--border-light)', paddingBottom: 24 }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--gold-primary)',
              display: 'block',
              marginBottom: 8,
            }}
          >
            Legal & Terms
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.2rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}
          >
            Terms of Service
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.86rem', margin: 0 }}>
            Last Updated: August 2026 • Kenyan Higher Education Advisory Platform
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.96rem' }}>
          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>
              1. Acceptance of Terms
            </h2>
            <p>By accessing and using Chuo Connect, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform.</p>
          </section>
          
          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>
              2. User Accounts
            </h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate and complete information when creating an account.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>
              3. Platform Guidelines
            </h2>
            <p>Chuo Connect provides tools for university discovery and comparison. The data provided is for informational purposes only. We strive for accuracy but do not guarantee that all information (such as fee structures or course availability) is perfectly up-to-date with individual institutions.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
