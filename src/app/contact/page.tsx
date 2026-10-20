import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactFormClient from '@/components/contact/ContactFormClient';

export const metadata: Metadata = {
  title: 'Contact Us & University Partnerships',
  description: 'Get in touch with the Chuo Connect Kenya team. We help students, universities, hostel operators, and scholarship partners connect.',
};

export default function ContactPage() {
  return (
    <>
      <div style={{ padding: '40px 20px', background: 'var(--bg-secondary)' }}>
        <div
          style={{
            background: 'var(--bg-primary)',
            border: '2px solid var(--border-medium)',
            borderRadius: 20,
            boxShadow: 'var(--shadow-neo)',
            padding: '60px 40px',
            maxWidth: 1000,
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
              backgroundSize: '28px 28px',
              opacity: 0.04,
              pointerEvents: 'none'
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 12 }}>Get In Touch</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 560 }}>
              Have a university partnership inquiry, student hostel listing, scholarship submission, or student admissions question? We&apos;re here to help.
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 48 }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 24 }}>Contact Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
                {[
                  { icon: <Mail size={24} />, label: 'Email', value: 'hello@chuoconnect.co.ke', href: 'mailto:hello@chuoconnect.co.ke' },
                  { icon: <Phone size={24} />, label: 'Phone / WhatsApp', value: '+254 700 000 000', href: 'https://wa.me/254700000000' },
                  { icon: <MapPin size={24} />, label: 'Location', value: 'Nairobi, Kenya', href: undefined },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        border: '2px solid var(--border-medium)',
                        borderRadius: 10,
                        background: 'var(--gold-glow)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: 'var(--text-primary)',
                        boxShadow: 'var(--shadow-neo)'
                      }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 4 }}>{c.label}</div>
                      {c.href ? (
                        <a href={c.href} style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', textDecoration: 'none' }}>{c.value}</a>
                      ) : (
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{c.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: 32,
                  background: 'var(--bg-primary)',
                  borderRadius: 16,
                  border: '2px solid var(--border-medium)',
                  boxShadow: 'var(--shadow-neo)'
                }}
              >
                <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 12 }}>Are you a University or Hostel Partner?</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
                  Join our B2B partner network to receive verified, KCSE-qualified student inquiries, manage your campus profile, and track admission conversions in real time.
                </p>
                <Link href="/portal" className="btn btn-navy">Open Partner Portal</Link>
              </div>
            </div>

            {/* Contact Form */}
            <div
              style={{
                background: 'var(--bg-primary)',
                borderRadius: 20,
                padding: 40,
                border: '2px solid var(--border-medium)',
                boxShadow: 'var(--shadow-neo)'
              }}
            >
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 24 }}>Send a Message</h2>
              <ContactFormClient />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
