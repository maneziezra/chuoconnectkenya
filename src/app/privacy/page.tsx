export const metadata = {
  title: 'Privacy Policy | Chuo Connect',
  description: 'Privacy Policy and Data Handling for Chuo Connect',
};

export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 800 }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)', marginBottom: 24 }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Last Updated: August 2026</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        <section>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: 12 }}>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, update your profile (including your KCSE Index Number), or save courses and universities to your dashboard.</p>
        </section>
        
        <section>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: 12 }}>2. How We Use Your Information</h2>
          <p>Your information is used to personalize your university recommendations, calculate your cluster points accurately, and allow partner universities to reach out if you express interest in their programs.</p>
        </section>

        <section>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: 12 }}>3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal data. We do not sell your personal information to third parties.</p>
        </section>
      </div>
    </div>
  );
}
