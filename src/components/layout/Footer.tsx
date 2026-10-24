import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        background: '#141619',
        color: '#F4F5F7',
        minHeight: '88svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(56px, 8vw, 96px) clamp(18px, 3.33vw, 48px) 32px',
        overflow: 'hidden',
      }}
    >
      {/* Top 4-Column Editorial Index */}
      <div
        style={{
          maxWidth: 'var(--max-width)',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div className="editorial-footer-grid">
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#C79B37', marginBottom: 16 }}>
              National Index
            </div>
            <p style={{ color: 'rgba(244, 245, 247, 0.76)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '30ch', marginBottom: 20 }}>
              Kenya&apos;s independent higher-education directory and KUCCPS cluster placement ledger covering 68 CUE &amp; TVETA institutions across all 47 counties.
            </p>
            <div className="tabular-nums" style={{ fontSize: '0.875rem', color: 'rgba(244, 245, 247, 0.56)' }}>
              2026 / 2027 Placement Edition
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#C79B37', marginBottom: 16 }}>
              Directory &amp; Placement
            </div>
            <ul className="editorial-footer-list">
              <li><Link href="/universities">68 Accredited Campuses</Link></li>
              <li><Link href="/courses">Degree &amp; Diploma Finder</Link></li>
              <li><Link href="/calculator">KUCCPS Cluster Calculator</Link></li>
              <li><Link href="/grades">KCSE Mean Grade Guides</Link></li>
              <li><Link href="/compare">Compare Campuses Side by Side</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#C79B37', marginBottom: 16 }}>
              Student Life &amp; Funding
            </div>
            <ul className="editorial-footer-list">
              <li><Link href="/scholarships">HEF &amp; HELB Scholarships</Link></li>
              <li><Link href="/housing">Verified Student Hostels</Link></li>
              <li><Link href="/guidance">Career &amp; Course Advisory</Link></li>
              <li><Link href="/events">Open Days &amp; Career Fairs</Link></li>
              <li><Link href="/dashboard">Student Workspace</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#C79B37', marginBottom: 16 }}>
              Governance &amp; Partners
            </div>
            <ul className="editorial-footer-list">
              <li><Link href="/portal">University Partner Portal</Link></li>
              <li><Link href="/about">Editorial Methodology</Link></li>
              <li><Link href="/contact">Admissions Desk Contact</Link></li>
              <li><Link href="/privacy">Data Protection Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Full-Width Inline SVG Wordmark */}
      <div
        style={{
          maxWidth: 'var(--max-width)',
          width: '100%',
          margin: '64px auto 0',
        }}
      >
        <svg
          viewBox="0 0 1200 145"
          width="100%"
          role="img"
          aria-label="ChuoConnect Kenya"
          style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
        >
          <text
            x="0"
            y="124"
            fill="#F4F5F7"
            fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif"
            fontWeight="800"
            fontSize="148"
            letterSpacing="-7"
          >
            CHUOCONNECT
          </text>
        </svg>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            marginTop: 20,
            fontSize: '0.875rem',
            color: 'rgba(244, 245, 247, 0.56)',
          }}
        >
          <span className="tabular-nums">© {new Date().getFullYear()} ChuoConnect Kenya. Built for Kenyan KCSE Graduates &amp; Families.</span>
          <span>Nairobi · Mombasa · Kisumu · Eldoret · Nakuru · Nyeri</span>
        </div>
      </div>

      <style>{`
        .editorial-footer-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr 1fr;
          gap: 40px;
        }
        .editorial-footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .editorial-footer-list a {
          color: rgba(244, 245, 247, 0.82);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          transition: color 0.18s ease;
        }
        .editorial-footer-list a:hover {
          color: #C79B37;
        }
        @media (max-width: 960px) {
          .editorial-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }
        @media (max-width: 560px) {
          .editorial-footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }
      `}</style>
    </footer>
  );
}
