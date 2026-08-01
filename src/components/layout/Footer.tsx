import Link from 'next/link';


export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-island">
        <div className="footer-grid">
          {/* Brand */}
          <div className="brand-col">
            <div className="brand-logo">
              <Link href="/">
                {/* SVG Logo matching the requested CC format */}
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ marginBottom: '16px' }}>
                  <path d="M22 8C14.268 8 8 14.268 8 22C8 29.732 14.268 36 22 36" stroke="var(--moss)" strokeWidth="4" strokeLinecap="round" />
                  <path d="M18 14C11.3726 14 6 19.3726 6 26C6 32.6274 11.3726 38 18 38" stroke="var(--citrus)" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: '1.5rem', fontWeight: 600, display: 'block', letterSpacing: '-0.03em', fontFamily: 'Inter, sans-serif' }}>
                  Chuo Connect
                </span>
              </Link>
            </div>
            <p className="brand-tagline">
              Kenya's premier campus discovery platform. Connecting students with their ideal higher education institutions.
            </p>
          </div>

          {/* Links Grid */}
          <div className="links-container">
            <div className="link-col">
              <span className="col-heading">Explore</span>
              <ul className="link-list">
                <li><Link href="/universities">University Directory</Link></li>
                <li><Link href="/courses">Course Finder</Link></li>
                <li><Link href="/compare">Compare Campuses</Link></li>
                <li><Link href="/events">Campus Events</Link></li>
              </ul>
            </div>

            <div className="link-col">
              <span className="col-heading">Resources</span>
              <ul className="link-list">
                <li><Link href="/guidance">Career Guidance</Link></li>
                <li><Link href="/scholarships">Scholarships</Link></li>
                <li><Link href="/housing">Student Housing</Link></li>
                <li><Link href="/dashboard">KUCCPS Calculator</Link></li>
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
          --footer-bg: var(--bg-tertiary, #F1F5F9);
          --footer-text: var(--navy-deep, #1A2338);
          --footer-accent: var(--gold-primary, #C79B37);
          --footer-border: var(--border-medium, #CBD5E1);
          --border-radius: 1.25rem;
          
          -webkit-text-size-adjust: 100%;
          letter-spacing: 0;
          font-family: Inter, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          color: var(--footer-text);
          font-size: 1.125rem;
          font-weight: 450;
          line-height: 150%;
          box-sizing: border-box;
          print-color-adjust: exact !important;
          display: block;
          z-index: 1;
          position: relative;
          padding: 0.5rem;
          background-color: var(--bg-primary, #FFFFFF);
        }

        .footer-island {
          background-color: var(--footer-bg);
          border-radius: 20px;
          border: 2px solid var(--border-light);
          margin: 20px;
          padding: 4rem 3rem 2rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .brand-logo a {
          display: block;
          color: var(--footer-text);
          text-decoration: none;
        }

        /* SVG override for Navy/Gold */
        .brand-logo svg path:nth-child(1) {
          stroke: var(--footer-text);
        }
        .brand-logo svg path:nth-child(2) {
          stroke: var(--footer-accent);
        }

        .brand-tagline {
          margin-top: 1.5rem;
          color: var(--text-secondary, #475569);
          font-size: 1rem;
          line-height: 1.6;
          max-width: 280px;
        }

        .links-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .col-heading {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
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
          gap: 0.875rem;
        }

        .link-list a {
          color: var(--text-secondary, #475569);
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.2s ease;
        }

        .link-list a:hover {
          color: var(--footer-accent);
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid var(--footer-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: var(--text-secondary, #475569);
        }

        .legal-links {
          display: flex;
          gap: 2rem;
        }

        .legal-links a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s;
        }

        .legal-links a:hover {
          color: var(--footer-text);
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .links-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 3rem 2rem;
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
            display: inline-block;
            padding: 8px 0;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-start;
          }
          .legal-links {
            flex-direction: column;
            gap: 1rem;
          }
          .legal-links a {
            display: inline-block;
            padding: 8px 0;
          }
        }
      `}</style>
    </footer>
  );
}

