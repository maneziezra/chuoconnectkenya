import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Sparkles, Building2, ArrowRight } from 'lucide-react';
import ContactFormClient from '@/components/contact/ContactFormClient';

export const metadata: Metadata = {
  title: 'Contact Us & University Partnerships',
  description: 'Get in touch with the Chuo Connect Kenya team. We help students, universities, hostel operators, and scholarship partners connect.',
};

export default function ContactPage() {
  return (
    <>
      {/* ── HERO BANNER ── */}
      <div style={{ padding: '32px 20px 0', background: 'var(--bg-secondary)' }}>
        <div
          style={{
            background: 'var(--apple-glass-bg)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-md)',
            padding: '52px 36px',
            maxWidth: 1040,
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: 'var(--gold-primary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              <Sparkles size={13} /> Support & Institutional Partnerships
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                marginBottom: 14,
              }}
            >
              Get In Touch
            </h1>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Have a university partnership inquiry, student hostel listing, scholarship submission, or KCSE placement question? We&apos;re here to help.
            </p>
          </div>
        </div>
      </div>

      {/* ── CONTACT BODY ── */}
      <section className="section" style={{ background: 'var(--bg-secondary)', padding: '48px 20px 80px' }}>
        <div className="container" style={{ maxWidth: 1040 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            {/* Contact Info Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    color: 'var(--text-primary)',
                    marginBottom: 18,
                  }}
                >
                  Contact Information
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { icon: <Mail size={20} />, label: 'Email Desk', value: 'hello@chuoconnect.co.ke', href: 'mailto:hello@chuoconnect.co.ke' },
                    { icon: <Phone size={20} />, label: 'Phone & WhatsApp', value: '+254 700 000 000', href: 'https://wa.me/254700000000' },
                    { icon: <MapPin size={20} />, label: 'Headquarters', value: 'Nairobi, Kenya', href: undefined },
                  ].map(c => (
                    <div
                      key={c.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '16px 18px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        borderTop: '1px solid var(--apple-glass-highlight)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          border: '1px solid var(--border-light)',
                          borderTop: '1px solid var(--apple-glass-highlight)',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--gold-glow)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: 'var(--gold-primary)',
                        }}
                      >
                        {c.icon}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: 'var(--text-tertiary)',
                            marginBottom: 2,
                          }}
                        >
                          {c.label}
                        </div>
                        {c.href ? (
                          <a
                            href={c.href}
                            style={{
                              fontWeight: 700,
                              fontSize: '0.98rem',
                              color: 'var(--text-primary)',
                              textDecoration: 'none',
                              display: 'inline-block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '100%',
                            }}
                          >
                            {c.value}
                          </a>
                        ) : (
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '0.98rem',
                              color: 'var(--text-primary)',
                            }}
                          >
                            {c.value}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partner Callout Card */}
              <div
                style={{
                  padding: 28,
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Building2 size={18} style={{ color: 'var(--gold-primary)' }} />
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: 'var(--gold-primary)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Institutional Network
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                    marginBottom: 8,
                  }}
                >
                  Are you a University or Hostel Partner?
                </h3>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    marginBottom: 20,
                    lineHeight: 1.6,
                  }}
                >
                  Join our verified partner network to receive KCSE-qualified student leads, manage your campus profile, and track admissions in real time.
                </p>
                <Link
                  href="/portal"
                  className="btn btn-navy"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 18px',
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  Open Partner Portal <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Contact Form Column */}
            <div
              style={{
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: '36px 32px',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                boxShadow: '0 20px 48px -12px rgba(26, 35, 56, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                Send a Message
              </h2>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  marginBottom: 24,
                  lineHeight: 1.5,
                }}
              >
                Fill out the form below and our team will get back to you within 2 business hours.
              </p>
              <ContactFormClient />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

