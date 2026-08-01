export const metadata = {
  title: 'Terms of Service | Chuo Connect',
  description: 'Terms of Service and User Agreement for Chuo Connect',
};

export default function TermsPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 800 }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)', marginBottom: 24 }}>Terms of Service</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Last Updated: August 2026</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        <section>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: 12 }}>1. Acceptance of Terms</h2>
          <p>By accessing and using Chuo Connect, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform.</p>
        </section>
        
        <section>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: 12 }}>2. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate and complete information when creating an account.</p>
        </section>

        <section>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: 12 }}>3. Platform Guidelines</h2>
          <p>Chuo Connect provides tools for university discovery and comparison. The data provided is for informational purposes only. We strive for accuracy but do not guarantee that all information (such as fee structures or course availability) is perfectly up-to-date with individual institutions.</p>
        </section>
      </div>
    </div>
  );
}
