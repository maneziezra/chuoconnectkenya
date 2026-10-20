import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-island">
        <div className="footer-grid">
          {/* Brand */}
          <div className="brand-col">
            <div className="brand-logo">
              <Link href="/" className="brand-link">
                {/* SVG Logo matching the requested CC format */}
                <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ marginBottom: '14px' }}>
                  <path d="M22 8C14.268 8 8 14.268 8 22C8 29.732 14.268 36 22 36" stroke="var(--navy-deep)" strokeWidth="4" strokeLinecap="round" />
                  <path d="M18 14C11.3726 14 6 19.3726 6 26C6 32.6274 11.3726 38 18 38" stroke="var(--gold-primary)" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: '1.45rem', fontWeight: 700, display: 'block', letterSpacing: '-0.028em', color: 'var(--text-primary)' }}>
                  Chuo Connect
                </span>
              </Link>
            </div>
            <p className="brand-tagline">
              Kenya&apos;s premier campus discovery platform. Connecting students with their ideal higher education institutions.
            </p>
          </div>

          {/* Links Grid */}
          <div className="links-container">
            <div className="link-col">
              <span className="col-heading">Explore</span>
              <ul className="link-list">
                <li><Link href="/universities">University Directory</Link></li>
                <li><Link href="/courses">Course Finder</Link></li>
                <li><Link href="/grades">Courses by KCSE Grade</Link></li>
                <li><Link href="/compare">Compare Campuses</Link></li>
                <li><Link href="/events">Campus Events</Link></li>
              </ul>
            </div>

            <div className="link-col">
              <span className="col-heading">Resources</span>
              <ul className="link-list">
                <li><Link href="/calculator">KUCCPS & HEF Calculator</Link></li>
                <li><Link href="/grades/c-plus">Courses for Grade C+</Link></li>
                <li><Link href="/grades/c">Diploma Bridge (Grade C)</Link></li>
                <li><Link href="/scholarships">Scholarships & HEF</Link></li>
                <li><Link href="/housing">Student Housing</Link></li>
              </ul>
            </div>

            <div className="link-col">
              <span className="col-heading">Students</span>
              <ul className="link-list">
                <li><Link href="/signup">Create Account</Link></li>
                <li><Link href="/login">Log In</Link></li>
                <li><Link href="/dashboard">My Dashboard</Link></li>
                <li><Link href="/about">About Us</Link></li>
              </ul>
            </div>

            <div className="link-col">
              <span className="col-heading">Institutions</span>
              <ul className="link-list">
                <li><Link href="/portal">Partner Portal</Link></li>
                <li><Link href="/portal">Register University</Link></li>
                <li><Link href="/contact">Advertise</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="copyright">© {new Date().getFullYear()} Chuo Connect Kenya. All rights reserved.</span>
          <div className="legal-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          --footer-bg: var(--bg-tertiary);
          --footer-text: var(--text-primary);
          --footer-accent: var(--gold-primary);
          --footer-border: var(--border-light);
          
          letter-spacing: 0;
          font-family: inherit;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          color: var(--footer-text);
          font-size: 1rem;
          font-weight: 450;
          line-height: 1.6;
          box-sizing: border-box;
          display: block;
          z-index: 1;
          position: relative;
          padding: 0 20px 24px;
          background-color: var(--bg-primary);
        }

        .footer-island {
          background-color: var(--footer-bg);
          border-radius: var(--radius-xl);
          border: 1px solid var(--footer-border);
          border-top: 1px solid var(--apple-glass-highlight);
          box-shadow: 0 20px 48px -12px rgba(26, 35, 56, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03);
          margin: 0 auto;
          max-width: 1360px;
          padding: 4rem 3.5rem 2.5rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 4rem;
          margin-bottom: 3.5rem;
        }

        .brand-link {
          display: inline-block;
          color: var(--footer-text);
          text-decoration: none;
          transition: transform var(--apple-press);
        }
        .brand-link:active {
          transform: scale(0.98);
        }

        .brand-tagline {
          margin-top: 1.25rem;
          color: var(--text-secondary);
          font-size: 0.92rem;
          line-height: 1.62;
          max-width: 290px;
        }

        .links-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .col-heading {
          display: block;
          font-size: 0.76rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          color: var(--footer-text);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .link-list a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.92rem;
          display: inline-block;
          transition: color var(--apple-ease), transform var(--apple-press);
        }

        .link-list a:hover {
          color: var(--footer-accent);
        }
        .link-list a:active {
          transform: scale(0.975);
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid var(--footer-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.84rem;
          color: var(--text-tertiary);
        }

        .legal-links {
          display: flex;
          gap: 2rem;
        }

        .legal-links a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--apple-ease), transform var(--apple-press);
          display: inline-block;
        }

        .legal-links a:hover {
          color: var(--footer-text);
        }
        .legal-links a:active {
          transform: scale(0.975);
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .links-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem 2rem;
          }
        }

        @media (max-width: 640px) {
          .footer-island {
            padding: 3rem 1.5rem 1.5rem;
          }
          .links-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .link-list a {
            padding: 4px 0;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 1.25rem;
            align-items: flex-start;
          }
          .legal-links {
            flex-direction: column;
            gap: 0.75rem;
          }
          .legal-links a {
            padding: 4px 0;
          }
        }
      `}</style>
    </footer>
  );
}
