export const metadata = {
  title: 'Privacy Policy & Data Handling',
  description: 'Privacy Policy and Data Handling for Chuo Connect Kenya',
};

export default function PrivacyPage() {
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
            Legal & Compliance
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
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.86rem', margin: 0 }}>
            Last Updated: August 2026 • Kenya Data Protection Act (2019) Compliant
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.96rem' }}>
          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>
              1. Information We Collect
            </h2>
            <p>We collect information you provide directly to us, such as when you create an account, update your profile (including your KCSE Index Number), or save courses and universities to your dashboard.</p>
          </section>
          
          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>
              2. How We Use Your Information
            </h2>
            <p>Your information is used to personalize your university recommendations, calculate your cluster points accurately, and allow partner universities to reach out if you express interest in their programs.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>
              3. Data Security
            </h2>
            <p>We implement industry-standard security measures to protect your personal data. We do not sell your personal information to third parties.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
